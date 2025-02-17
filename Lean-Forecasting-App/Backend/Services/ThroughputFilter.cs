using System.Diagnostics;
using backend.Models;
namespace backend.Services
{
    /// <summary>
    /// Contains methods for calculating and filtering throughput data for stories and features.
    /// </summary>
    /// <remarks>
    /// Author: Phuong Diem Quynh, Nguyen
    /// Author: Daniel Tverdunov
    /// </remarks>
    public class ThroughputFilter
    {
        /// <summary>
        /// Represents a summary of throughput, including 50% and 85% cumulative thresholds.
        /// </summary>
        public class ThroughputSummary
    {
            /// <summary>
            /// A dictionary where keys represent the filter criteria (e.g., sprints or months) and values represent the throughput count.
            /// </summary>
            public Dictionary<int, int> ThroughputByFilter { get; set; }

            /// <summary>
            /// The throughput value at the 50% cumulative threshold.
            /// </summary>
            public int Percent50 { get; set; }

            /// <summary>
            /// The throughput value at the 85% cumulative threshold.
            /// </summary>
            public int Percent85 { get; set; }
    }
        /// <summary>
        /// Calculates throughput for all sprints based on completed stories.
        /// </summary>
        /// <param name="stories">A list of Story objects to process.</param>
        /// <returns>
        /// A dictionary where keys are sprint numbers and values are the count of stories completed in each sprint.
        /// </returns>
        public static Dictionary<int, int> ThroughputAllSprints(List<Story> stories)
    {
        var throughput = new Dictionary<int, int>();

        foreach (var story in stories)
        {
            if (story.State == "Done" && story.SprintNumberClosed != -1)
            {
                if (!throughput.ContainsKey(story.SprintNumberClosed))
                {
                    throughput[story.SprintNumberClosed] = 0;
                }
                throughput[story.SprintNumberClosed]++;
            }
        }

        return throughput;
    }
    /// <summary>
    /// Calculates throughput for all months based on completed features (excluding maintenance).
    /// </summary>
    /// <param name="features">A list of Feature objects to process.</param>
    /// <returns>
    /// A dictionary where keys are month numbers and values are the count of features completed in each month.
    /// </returns>
        public static Dictionary<int, int> ThroughputAllMonth(List<Feature> features)
    {
        var throughput = new Dictionary<int, int>();

        foreach (var feature in features)
        {
            if (feature.State == "Done" && feature.Tag != "Maintenance" && feature.MonthClosed != -1)
            {
                if (!throughput.ContainsKey(feature.MonthClosed))
                {
                    throughput[feature.MonthClosed] = 0;
                }
                throughput[feature.MonthClosed]++;
            }
        }

        return throughput;
    }
        /// <summary>
        /// Filters throughput data by sprint within the specified range.
        /// </summary>
        /// <typeparam name="T">The type of items to filter, inheriting from the Item class.</typeparam>
        /// <param name="items">A list of items to filter.</param>
        /// <param name="start">The starting sprint number.</param>
        /// <param name="end">The ending sprint number.</param>
        /// <returns>
        /// A ThroughputSummary object containing throughput by sprint, 50% cumulative throughput, and 85% cumulative throughput.
        /// </returns>
        /// <exception cref="ArgumentNullException">Thrown if the items list is null.</exception>
        public static ThroughputSummary FilterBySprint<T>(List<T> items, int start, int end) where T : Item
        {
            ArgumentNullException.ThrowIfNull(items);

            var throughputBySprint  = Enumerable.Range(start, end - start + 1).ToDictionary(sprint => sprint, _ => 0);

            // Filter and group items by SprintNumberClosed
            var groupedItems = items
                .Where(item =>
                    (item.Type == "Story" || 
                    (item.Type == "Feature" && item is Feature feature && feature.Tag != "Maintenance")) &&
                    item.State == "Done" &&
                    item.ClosedDate.HasValue &&
                    item.SprintNumberClosed >= start &&
                    item.SprintNumberClosed <= end)
                .GroupBy(item => item.SprintNumberClosed);

            // Update the result with the actual counts
            foreach (var group in groupedItems)
            {
                throughputBySprint[group.Key] = group.Count(); // Assign the count for the sprint
            }

            // Get throughput summary for 50% and 85%
            var throughputSummary = SummaryCalculation(throughputBySprint);
            // Return the throughput summary
            return new ThroughputSummary
            {
                ThroughputByFilter = throughputBySprint,
                Percent50 = throughputSummary.throughput50Percent,
                Percent85 = throughputSummary.throughput85Percent
            };
        }
        /// <summary>
        /// Filters throughput data by month within the specified range.
        /// </summary>
        /// <typeparam name="T">The type of items to filter, inheriting from the Item class.</typeparam>
        /// <param name="items">A list of items to filter.</param>
        /// <param name="start">The starting month number.</param>
        /// <param name="end">The ending month number.</param>
        /// <returns>
        /// A ThroughputSummary object containing throughput by month, 50% cumulative throughput, and 85% cumulative throughput.
        /// </returns>
        /// <exception cref="ArgumentNullException">Thrown if the items list is null.</exception>
        public static ThroughputSummary FilterByMonth<T>(List<T> items, int start, int end) where T : Item
        {
            ArgumentNullException.ThrowIfNull(items);

            var throughputByMonth = Enumerable.Range(start, end - start + 1).ToDictionary(month => month, _ => 0);

            // Filter and group items by MonthClosed
                var groupedItems = items
                    .Where(item =>
                        (item.Type == "Story" || 
                        (item.Type == "Feature" && item is Feature feature && feature.Tag != "Maintenance")) &&
                        item.State == "Done" &&
                        item.ClosedDate.HasValue &&
                        item.MonthClosed >= start &&
                        item.MonthClosed <= end)
                    .GroupBy(item => item.MonthClosed);

            // Update the result with the actual counts
            foreach (var group in groupedItems)
            {
                throughputByMonth[group.Key] = group.Count();
            }

            var throughputSummary = SummaryCalculation(throughputByMonth);

            // Return a ThroughputSummary object
            return new ThroughputSummary
            {
                Percent50 = throughputSummary.throughput50Percent,
                Percent85 = throughputSummary.throughput85Percent,
                ThroughputByFilter = throughputByMonth
            };
        }
        
    /// <summary>
    /// Calculates throughput summary values at 50% and 85% thresholds based on sorted throughput data.
    /// </summary>
    /// <param name="data">A dictionary of throughput data, where keys are filter criteria (e.g., sprints or months) and values are counts.</param>
    /// <returns>A tuple containing throughput values at the 50% and 85% thresholds.</returns>
    public static (int throughput50Percent, int throughput85Percent) SummaryCalculation(Dictionary<int, int> data)
    {
        // Sort the data by throughput in descending order for cumulative percentage calculation
        var sortedData = data.OrderByDescending(item => item.Value).ToList();

        // Calculate total throughput to determine percentages
        int totalThroughput = data.Values.Sum();

        // Initialize variables for cumulative throughput and percentage
        int cumulativeThroughput = 0;

        // Initialize variables for storing throughput at 50% and 85%
        int throughput50Percent = 0;
        int throughput85Percent = 0;

        // Loop through the sorted list to calculate cumulative throughput
        foreach (var item in sortedData)
        {
            int throughput = item.Value;

            cumulativeThroughput += throughput;
            double cumulativePercentage = (double)cumulativeThroughput / totalThroughput * 100;

            // Check if we have reached 50% threshold
            if (throughput50Percent == 0 && cumulativePercentage >= 50)
            {
                throughput50Percent = throughput;
            }

            // Check if we have reached 85% threshold
            if (throughput85Percent == 0 && cumulativePercentage >= 85)
            {
                throughput85Percent = throughput;
            }

            // If both thresholds are reached, we can break early
            if (throughput50Percent > 0 && throughput85Percent > 0)
            {
                break;
            }
        }

        // Return the throughput values at 50% and 85%
        return (throughput50Percent, throughput85Percent);
    }

    }
}