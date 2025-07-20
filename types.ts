
export interface Video {
  id: string;
  title: string;
  created_at: string; // ISO 8601 string format
  tags: string[];
  thumbnail_url: string;
  duration: number; // in seconds
  views: number;
}
