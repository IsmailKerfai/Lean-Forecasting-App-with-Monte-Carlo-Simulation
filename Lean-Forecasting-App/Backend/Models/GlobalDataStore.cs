namespace backend.Models
{
    public static class GlobalDataStore
    {
        public static List<Feature> Features {get; set;} 
        public static List<Story> Stories {get; set;} 
        static GlobalDataStore() {
        Features = Feature.ReadFeatures("./data/file_features.csv");
        Stories = Story.ReadStories("./data/file_stories.csv");
    }
    }
 
}