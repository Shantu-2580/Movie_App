import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_TABLE =
  process.env.EXPO_PUBLIC_SUPABASE_TRENDING_TABLE || "trending_searches";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const { data: existing, error: selectError } = await supabase
      .from(SUPABASE_TABLE)
      .select("id, count")
      .eq("searchTerm", query)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error: updateError } = await supabase
        .from(SUPABASE_TABLE)
        .update({ count: (existing as any).count + 1 })
        .eq("id", (existing as any).id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase.from(SUPABASE_TABLE).insert({
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("searchTerm, movie_id, title, count, poster_url")
      .order("count", { ascending: false })
      .limit(5);

    if (error) throw error;
    return (data || undefined) as unknown as TrendingMovie[] | undefined;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};