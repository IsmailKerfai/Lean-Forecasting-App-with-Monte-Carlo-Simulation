using backend.Models;

namespace backend.Services
{
    /// <summary>
    /// Provides services for Monte Carlo simulations related to feature management.
    /// </summary>
    public class MonteCarloFeaturesService
    {
        private readonly Filter _filterService;

        public MonteCarloFeaturesService(Filter filterService)
        {
            _filterService = filterService;
        }

        /// <summary>
        /// Retrieves a list of the number of child items for features within the specified date range.
        /// </summary>
        public List<int> GetListOfNumOfChildItems(DateOnly startDate, DateOnly endDate) 
        {
            List<Feature> features = GlobalDataStore.Features;
            
            var filteredList = features.Where(f => f.Type == "Feature" 
                                                && f.State == "Done"
                                                && f.ClosedDate.HasValue
                                                && f.ClosedDate.Value >= startDate
                                                && f.ClosedDate.Value <= endDate
                                                && f.NumOfChildItems > 0
                                                && f.Tag != "Maintenance")
                                        .Select(f => f.NumOfChildItems)
                                        .ToList();
            
            return filteredList;
        }

        /// <summary>
        /// Calculates the value at the specified percentile from a list of values.
        /// </summary>

        public int GetPercentileValue(List<int> values, double percentile)
        {
            values.Sort();
            int totalSum = values.Sum();

            if (totalSum == 0) return 0; 
            if (percentile <= 0) return values[0];
            if (percentile >= 100) return values[values.Count - 1]; 

            double targetCumulative = (percentile / 100) * totalSum;

            int cumulativeSum = 0;

            foreach (int value in values)
            {
                cumulativeSum += value;

                if (cumulativeSum >= targetCumulative)
                {
                    return value;
                }
            }

            return values[values.Count - 1];
        }

        /// <summary>
        /// Calculates feature simulation results for a given time range using precomputed simulation data.
        /// </summary>

        public  ResultForEndDateFeatures CalculateNumberOfFeaturesWithPrecomputedSimulation(
            DateOnly startDate,
            DateOnly endDate,
            List<int> precomputedSimulationResults,
            List<int> precomputedChildrenResults )
        {

            precomputedChildrenResults.Sort();


            int P95 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 1-0.95);
            int P85 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 1-0.85);
            int P50 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 0.5);
            int StoriesPerFeature = GetPercentileValue(precomputedChildrenResults, 85);

            double numberOfWeeks = (endDate.ToDateTime(TimeOnly.MinValue) - startDate.ToDateTime(TimeOnly.MinValue)).Days / 7.0 ;
            int numberOfStoriesP95 = (int)Math.Round (numberOfWeeks * P95);
            int numberOfStoriesP85 = (int)Math.Round(numberOfWeeks * P85);
            int numberOfStoriesP50 = (int)Math.Round(numberOfWeeks * P50);


            int numberOfRightSizedFeatureP95 = numberOfStoriesP95 / StoriesPerFeature;
            int numberOfRightSizedFeatureP85 = numberOfStoriesP85 / StoriesPerFeature;
            int numberOfRightSizedFeatureP50 = numberOfStoriesP50 / StoriesPerFeature;
            return new ResultForEndDateFeatures
            {
                NumberOfWeeks =(int)Math.Ceiling(numberOfWeeks),
                P50 = P50,
                P85 = P85,
                P95 = P95,
                StoriesPerFeature = StoriesPerFeature,
                NumberOfStoriesP95 = numberOfStoriesP95,
                NumberOfStoriesP85 = numberOfStoriesP85,
                NumberOfStoriesP50 = numberOfStoriesP50, 
                NumberOfRightSizedFeatureP95 = numberOfRightSizedFeatureP95,
                NumberOfRightSizedFeatureP85 = numberOfRightSizedFeatureP85,
                NumberOfRightSizedFeatureP50 = numberOfRightSizedFeatureP50,
            };
        }

        /// <summary>
        /// Calculates the end date for completing a target number of features using precomputed simulation data.
        /// </summary>
        public  ResultForNumberOfFeatures CalculateFeatureEndDateWithPrecomputedSimulation(
            DateOnly startDate,
            int targetFeature,
            List<int> precomputedSimulationResults,
            List<int> precomputedChildrenResults)
        {
            precomputedSimulationResults.Sort();


            int P95 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 1-0.95);
            int P85 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 1-0.85);
            int P50 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 0.5);
            int StoriesPerFeature = GetPercentileValue(precomputedChildrenResults, 85);

            int NumberOfStories = StoriesPerFeature * targetFeature;

            int NumberOfWeeksP95 =  NumberOfStories / P95;
            int NumberOfWeeksP85 =  NumberOfStories / P85;
            int NumberOfWeeksP50 =  NumberOfStories / P50;

            DateOnly EndDateP95 = startDate.AddDays(NumberOfWeeksP95 * 7);
            DateOnly EndDateP85 = startDate.AddDays(NumberOfWeeksP85 * 7);
            DateOnly EndDateP50 = startDate.AddDays(NumberOfWeeksP50 * 7);

            return new ResultForNumberOfFeatures
            {
                P50 = P50,
                P85 = P85,
                P95 = P95,
                StoriesPerFeature = StoriesPerFeature,
                NumberOfStories = NumberOfStories,
                NumberOfWeeksP95 = NumberOfWeeksP95,
                NumberOfWeeksP85 = NumberOfWeeksP85,
                NumberOfWeeksP50 = NumberOfWeeksP50,
                EndDateP95 = EndDateP95,
                EndDateP85 = EndDateP85,
                EndDateP50 = EndDateP50,
            };

        }

    }



    /// <summary>
    /// Represents the results of a feature simulation for a specific end date.
    /// </summary>
    public class ResultForEndDateFeatures
    {
        public int NumberOfWeeks { get; set; }
        public int P50 { get; set; }
        public int P85 { get; set; }
        public int P95 { get; set; }

        public int StoriesPerFeature { get; set; }

        public int NumberOfStoriesP95 { get; set; }
        public int NumberOfStoriesP85 { get; set; }
        public int NumberOfStoriesP50 { get; set; }

        public int NumberOfRightSizedFeatureP95 { get; set; }
        public int NumberOfRightSizedFeatureP85 { get; set; }
        public int NumberOfRightSizedFeatureP50 { get; set; }
        
    }

    /// <summary>
    /// Represents the results of a feature simulation for calculating the number of features required to reach an end date.
    /// </summary>
    public class ResultForNumberOfFeatures
    {
        public int NumberOfStories { get; set; }
        public int P50 { get; set; }
        public int P85 { get; set; }
        public int P95 { get; set; }

        public int StoriesPerFeature { get; set; }

        public int NumberOfWeeksP95 { get; set; }
        public int NumberOfWeeksP85 { get; set; }
        public int NumberOfWeeksP50 { get; set; }

        public DateOnly EndDateP50 { get; set; }
        public DateOnly EndDateP85 { get; set; }
        public DateOnly EndDateP95 { get; set; }
    }
}
