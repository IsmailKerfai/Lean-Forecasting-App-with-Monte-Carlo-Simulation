using System.Collections.ObjectModel;
using System.Diagnostics;
using backend.Models;
namespace backend.Services
{
    /// <summary>
    /// Provides filtering and processing methods for stories and features.
    /// ATTENTION: 
    /// The case leadDays = 0 is not handled, because it was not in the oracle and not in the abnahmefälle. 
    /// The nececessary code is commented out.
    /// Comment it in and change LeadDays > 0 to LeadDays >= 0 in CycleStories and CycleFeatures if needed.
    /// </summary>
    /// <author>Jan Bretz, Daniel Tverdunov</author>
    public class CycleFilter
    {   
        // List of stories and features        
        private static List<Story> storyList;
        private static List<Feature> FeatureList;           

        /// <summary>
        /// Filters the stories based on the provided date range if they exists.
        /// </summary>
        /// <param name="items">The list of stories to filter.</param>
        /// <param name="start">The start date of the range.</param>
        /// <param name="end">The end date of the range.</param>        
        public static void CycleStories(List<Story> items, DateOnly? start, DateOnly? end){
            ArgumentNullException.ThrowIfNull(items);
            if(start.HasValue && end.HasValue){     //if a start and end date is provided
                storyList = items
                    .Where(item => item.Type == "Story" 
                                && item.State == "Done"
                                && item.ClosedDate.HasValue
                                && item.CycleDays >= 0
                                && item.LeadDays > 0 
                                && item.ClosedDate.Value >= start
                                && item.ClosedDate.Value <= end
                                )
                    .ToList();
            } else {
                storyList = items
                    .Where(item => item.Type == "Story" 
                                && item.State == "Done"
                                && item.ClosedDate.HasValue
                                && item.CycleDays >= 0
                                && item.LeadDays > 0
                                )
                    .ToList();
            }
        }

        /// <summary>
        /// Filters the features based on the provided date range if they exists.
        /// </summary>
        /// <param name="items">The list of features to filter.</param>
        /// <param name="start">The start date of the range.</param>
        /// <param name="end">The end date of the range.</param>
        public static void CycleFeatures(List<Feature> items, DateOnly? start, DateOnly? end){
            ArgumentNullException.ThrowIfNull(items);
            // Filter the items based on the conditions
            if(start.HasValue && end.HasValue){
                    FeatureList = items
                    .Where(item => (item.Type == "Feature" && item is Feature feature && feature.Tag != "Maintenance")
                                && item.State == "Done"
                                && item.ClosedDate.HasValue
                                && item.CycleDays >= 0
                                && item.LeadDays > 0
                                && item.ClosedDate.Value >= start
                                && item.ClosedDate.Value <= end
                                )
                    .ToList();                
            } else {
                FeatureList = items
                    .Where(item => (item.Type == "Feature" && item is Feature feature && feature.Tag != "Maintenance")
                                && item.State == "Done"
                                && item.ClosedDate.HasValue
                                && item.CycleDays >= 0
                                && item.LeadDays > 0)
                    .ToList();
            }
        }

        /// <summary>
        /// Checks if the story list is empty.
        /// </summary>
        /// <returns>Returns 0 if the story list is empty, otherwise returns 1 for API.</returns>
        public static int isStoryEmpty(){
            if(storyList.Count == 0) return 0;
            return 1;
        }

        /// <summary>
        /// Checks if the feature list is empty.
        /// </summary>
        /// <returns>Returns 0 if the feature list is empty, otherwise returns 1 for API.</returns>
        public static int isFeatureEmpty(){
            if(FeatureList.Count == 0) return 0;
            return 1;
        }

        /// <summary>
        /// Returns the X-axis labels for the specified type.
        /// </summary>
        /// <param name="type">The type of items ("story" or "feature").</param>
        /// <returns>An array of strings representing the X-axis labels.</returns>
        public static String[] returnXAxis(String type){
            List<String> list = new List<String>();
            switch(type.ToLower()){
                case "story":
                    var storyListCopy = new List<Story>(storyList);
                    foreach(Story e in storyListCopy){
                    list.Add(e.ClosedDate.ToString());
                    }
                    return list.ToArray();
                case "feature":
                    var featureListCopy = new List<Feature>(FeatureList);
                    foreach(Feature e in featureListCopy){
                    list.Add(e.ClosedDate.ToString());
                    }
                    return list.ToArray();
                default:
                    return list.ToArray();
            }
        }

        /// <summary>
        /// Returns the Y-axis values for the specified type and data type.
        /// </summary>
        /// <param name="type">The type of items ("story" or "feature").</param>
        /// <param name="dataType">The data type ("cycledays" or "leaddays").</param>
        /// <returns>An array of doubles representing the Y-axis values.</returns>
        public static double[] returnYAxis(String type, String dataType){
            List<double> list = new List<double>();
            switch(type.ToLower()){
                case "story":
                    List<Story> storyListCopy = storyList; // copy of the list
                    foreach(Story e in storyListCopy){  //return depends of the datatype
                        if(dataType.ToLower().Equals("cycledays")){
                            list.Add(e.CycleDays);
                        } else if(dataType.Equals("leaddays")){
                            list.Add(e.LeadDays);
                        } else {
                            /*if(e.LeadDays == 0){    //cannot divide by 0
                                list.Add(0);
                            } else {
                                list.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                            }*/
                            list.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                        }
                    }
                    return list.ToArray();
                case "feature":
                    List<Feature> featureListCopy = FeatureList;
                    foreach(Feature e in featureListCopy){
                        if(dataType.ToLower().Equals("cycledays")){
                            list.Add(e.CycleDays);
                        } else if(dataType.Equals("leaddays")){
                            list.Add(e.LeadDays);
                        } else {
                            /*if(e.LeadDays == 0){        //cannot divide by 0
                                list.Add(0);
                            } else {
                                list.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                            }*/
                            list.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                        }
                    }
                    return list.ToArray();
                default:
                    return list.ToArray();
            }
        }
        
        /// <summary>
        /// Returns the 50th percentile value for the specified type and data type.
        /// </summary>
        /// <param name="type">The type of items ("story" or "feature").</param>
        /// <param name="datatype">The data type ("cycledays" or "leaddays").</param>
        /// <returns>The 50th percentile value.</returns>
        public static double Line50(String type, String datatype)
        {
            switch(type.ToLower()){
                case "story":
                    List<Story> list = storyList.Select(story => new Story  //deep copy to avoid runtime error
                    {
                        Type = story.Type,
                        State = story.State,
                        ClosedDate = story.ClosedDate,
                        CycleDays = story.CycleDays,
                        LeadDays = story.LeadDays,
                    }).ToList();
                    List<double> percentile = new List<double>();
                    foreach(Story e in list){   //calculate the percentile
                        /*if(e.LeadDays == 0){
                            percentile.Add(0);
                        } else {
                            percentile.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                        }*/
                        percentile.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                    }
                    for(int i = 0; i < list.Count; i++){    //return depends of the datatype
                        if((double)i / (double)list.Count >= 0.5){
                            if(datatype.ToLower().Equals("cycledays")){
                                list.Sort((x,y) => x.CycleDays.CompareTo(y.CycleDays));
                                return list[i-1].CycleDays;
                            } else if(datatype.Equals("leaddays")){
                                list.Sort((x,y) => x.LeadDays.CompareTo(y.LeadDays));
                                return list[i-1].LeadDays;
                            } else {
                                percentile.Sort();
                                return percentile[i-1];
                            }
                        }
                    }
                    break;
                case "feature":
                    List<Feature> list2 = FeatureList.Select(feature => new Feature     //make a copy of the list
                    {
                        Type = feature.Type,
                        State = feature.State,
                        ClosedDate = feature.ClosedDate,
                        CycleDays = feature.CycleDays,
                        LeadDays = feature.LeadDays,
                        Tag = feature.Tag,
                    }).ToList();
                    List<double> percentile2 = new List<double>();
                    foreach(Feature e in list2){
                        /*if(e.LeadDays == 0){
                            percentile2.Add(0);    //cannot divide by 0
                        } else {
                            percentile2.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                        }*/
                        percentile2.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                    }

                    for(int i = 0; i < list2.Count; i++){
                        if((double)i / (double)list2.Count >= 0.5){
                            if(datatype.ToLower().Equals("cycledays")){
                                list2.Sort((x,y) => x.CycleDays.CompareTo(y.CycleDays));
                                return list2[i-1].CycleDays;
                            } else if(datatype.Equals("leaddays")){
                                list2.Sort((x,y) => x.LeadDays.CompareTo(y.LeadDays));
                                return list2[i-1].LeadDays;
                            } else {
                                percentile2.Sort();
                                return (percentile2[i-1]);
                            }
                        }
                    }
                    break;
                    
                default:
                    return -1;
            }
           return -1;
        }
        
        /// <summary>
        /// Returns the 85th percentile value for the specified type and data type.
        /// </summary>
        /// <param name="type">The type of items ("story" or "feature").</param>
        /// <param name="datatype">The data type ("cycledays" or "leaddays").</param>
        /// <returns>The 85th percentile value.</returns>
        public static double Line85(String type, String datatype)
        {
            switch(type.ToLower()){
                case "story":
                    List<Story> list = storyList.Select(story => new Story  //deep copy to avoid runtime error
                    {
                        Type = story.Type,
                        State = story.State,
                        ClosedDate = story.ClosedDate,
                        CycleDays = story.CycleDays,
                        LeadDays = story.LeadDays,
                    }).ToList();
                    List<double> percentile = new List<double>();   //calculate the percentile
                    foreach(Story e in list){
                        /*if(e.LeadDays == 0){
                            percentile.Add(0);      //cannot divide by 0
                        } else {
                            percentile.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                        }*/
                        percentile.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                    }
                    for(int i = 0; i < list.Count; i++){
                        if((double)i / (double)list.Count >= 0.85){  //return depends of the datatype
                            if(datatype.ToLower().Equals("cycledays")){
                                list.Sort((x,y) => x.CycleDays.CompareTo(y.CycleDays));
                                return list[i-1].CycleDays;
                            } else if(datatype.Equals("leaddays")){
                                list.Sort((x,y) => x.LeadDays.CompareTo(y.LeadDays));
                                return list[i-1].LeadDays;
                            } else {
                                percentile.Sort();
                                return percentile[i-1];
                            }
                        }
                    }
                    break;
                case "feature":
                    List<Feature> list2 = FeatureList.Select(feature => new Feature     //make a deep copy of the list
                    {
                        Type = feature.Type,
                        State = feature.State,
                        ClosedDate = feature.ClosedDate,
                        CycleDays = feature.CycleDays,
                        LeadDays = feature.LeadDays,
                        Tag = feature.Tag,
                    }).ToList();
                    List<double> percentile2 = new List<double>();
                    foreach(Feature e in list2){
                        /*if(e.LeadDays == 0){
                            percentile2.Add(0);     //cannot divide by 0
                        } else {
                            percentile2.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                        }*/
                        percentile2.Add((double)e.CycleDays/(double)e.LeadDays * 100);
                    }

                    for(int i = 0; i < list2.Count; i++){
                        if((double)i / (double)list2.Count >= 0.85){
                            if(datatype.ToLower().Equals("cycledays")){
                                list2.Sort((x,y) => x.CycleDays.CompareTo(y.CycleDays));
                                return list2[i-1].CycleDays;
                            } else if(datatype.Equals("leaddays")){
                                list2.Sort((x,y) => x.LeadDays.CompareTo(y.LeadDays));
                                return list2[i-1].LeadDays;
                            } else {
                                percentile2.Sort();
                                return (percentile2[i-1]);
                            }
                        }
                    }
                    break;
                default:
                    return -1;
            }
           return -1;
        }
    } 
}
