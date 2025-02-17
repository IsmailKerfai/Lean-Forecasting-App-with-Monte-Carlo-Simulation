namespace backend.Services
{

    /// <summary>
    /// Provides Monte Carlo-based calculations for estimating story timelines and throughput.
    /// </summary>
    public class MonteCarloStoriesService
    {
       
        //private static readonly DateOnly startDate = new DateOnly(2024, 11, 22);
        private static readonly int sprintLength = 2;

        /// <summary>
        /// Calculates the estimated end dates (P50 and P85) for completing a specified number of stories.
        /// </summary>
        public ResultForNumberOfStories CalculateStoryEndDateWithPrecomputedSimulation(
            DateOnly startDate, 
            int numberOfStories, 
            List<int> precomputedSimulationResults)
        {
            double P50 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 0.5);
            double P85 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 1-0.85);

            double totalSprintsP50 = numberOfStories / P50;
            double totalSprintsP85 = numberOfStories / P85;

            double totalWeeksP50 = totalSprintsP50 * sprintLength;
            double totalWeeksP85 = totalSprintsP85 * sprintLength;

            DateTime p50DateTime = startDate.ToDateTime(new TimeOnly(0, 0)).AddDays(totalWeeksP50 * 7);
            DateTime p85DateTime = startDate.ToDateTime(new TimeOnly(0, 0)).AddDays(totalWeeksP85 * 7);

            return new ResultForNumberOfStories
            {
                P50 = (int)P50 ,
                P85 = (int)P85,
                TotalWeeksP50 = totalWeeksP50,
                TotalWeeksP85 = totalWeeksP85,
                TotalSprintsP50 = totalSprintsP50,
                TotalSprintsP85 = totalSprintsP85,
                EndDateP50 = DateOnly.FromDateTime(p50DateTime),
                EndDateP85 = DateOnly.FromDateTime(p85DateTime)
            };
        }

        /// <summary>
        /// Calculates the number of stories that can be completed between two dates using precomputed simulation results.
        /// </summary>
        public  ResultForEndDateStories CalculateNumberOfStoriesWithPrecomputedSimulation(
            DateOnly startDate,
            DateOnly endDate,
            List<int> precomputedSimulationResults)
        {
            double totalWeeks = (endDate.ToDateTime(TimeOnly.MinValue) - startDate.ToDateTime(TimeOnly.MinValue)).Days / 7;
            double totalSprints = totalWeeks / sprintLength;
            int P50 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 0.5);
            int P85 = MonteCarloSimulationUtils.CalculatePercentile(precomputedSimulationResults, 1-0.85);   

            return new ResultForEndDateStories
            {
                P50 = P50,
                P85 = P85,
                TotalWeeks = totalWeeks,
                TotalSprints = totalSprints,
                NumberOfStoriesP50 = (int)( P50 * totalSprints),
                NumberOfStoriesP85 = (int)(P85* totalSprints)
            };
        }
    }

    /// <summary>
    /// Represents the result of calculating the number of stories for a given end date.
    /// </summary>
    public class ResultForEndDateStories
    {
        public int P50 { get; set; }
        public int P85 { get; set; }
        public double TotalWeeks { get; set; }
        public double TotalSprints { get; set; }
        public int NumberOfStoriesP50 {get; set;}
        public int NumberOfStoriesP85{get; set;}

    }

    /// <summary>
    /// Represents the result of calculating story end dates for a given number of stories.
    /// </summary>
    public class ResultForNumberOfStories
    {
        public int P50 { get; set; }
        public int P85 { get; set; }
        public double TotalWeeksP50 { get; set; }
        public double TotalWeeksP85 { get; set; }
        public double TotalSprintsP50 { get; set; }
        public double TotalSprintsP85 { get; set; }
        public DateOnly EndDateP50 { get; set; }
        public DateOnly EndDateP85 { get; set; }
    }
}
