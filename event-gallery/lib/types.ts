export interface MatchResult {
  matched_photos: string[];
  similarity_scores: number[];
}

export interface EventPhoto {
  url: string;
  filename: string;
}
