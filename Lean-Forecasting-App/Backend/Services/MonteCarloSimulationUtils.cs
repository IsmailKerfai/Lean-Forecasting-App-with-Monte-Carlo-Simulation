namespace backend.Services
{
    /// <summary>
    /// Utility class for performing Monte Carlo simulations and related calculations.
    /// </summary>
    public static class MonteCarloSimulationUtils
    {

        /// <summary>
        /// Calculates the value at the specified percentile for a sorted dataset.
        /// </summary>
        public static int CalculatePercentile(List<int> sortedData, double percentile)
        {
            if (sortedData.Count == 0)
                throw new InvalidOperationException("Cannot calculate percentile for an empty dataset.");

            sortedData.Sort();
            int index = (int)(percentile * sortedData.Count);
            return sortedData[index - 1];
        }

        /// <summary>
        /// Runs a Monte Carlo simulation based on historical data.
        /// </summary>
        public static List<int> RunSimulation(int[,] historicalData, int iterations)
        {
            Random rand = new();
            int numberOfDays = historicalData.GetLength(0);
            int numberOfSprints = historicalData.GetLength(1);

            var simulationResults = new List<int>(iterations);
            for (int sim = 0; sim < iterations; sim++)
            {
                int sprintThroughput = 0;
                for (int day = 0; day < numberOfDays; day++)
                {
                    int randomSprint = rand.Next(0, numberOfSprints);
                    sprintThroughput += historicalData[day, randomSprint];
                }
                simulationResults.Add(sprintThroughput);
            }
            return simulationResults;
        }

        /// <summary>
        /// Calculates a histogram for a dataset, dividing it into bins.
        /// </summary>
        public static Dictionary<string, object> CalculateHistogram(List<int> data, int numberOfBins)
        {
            var min = data.Min();
            var max = data.Max();
            var binWidth = Math.Ceiling((double)(max - min) / numberOfBins); 

            var bins = new List<int>();
            var frequencies = new List<int>(new int[numberOfBins]);

            for (int i = 0; i <= numberOfBins; i++)
            {
                bins.Add(min + (int)(i * binWidth)); 
            }

            foreach (var value in data)
            {
                int binIndex = Math.Min((int)((value - min) / binWidth), numberOfBins - 1);
                frequencies[binIndex]++;
            }

            return new Dictionary<string, object>
            {
                { "Bins ", bins },
                { "Frequencies ", frequencies }
            };
        }

    }
}
