using CsvHelper.Configuration;
using backend.Models;

namespace backend.CsvMappings
{

    /// <summary>
    /// A mapping configuration for the `Story` model used by CsvHelper.
    /// Defines how each property of the `Story` model corresponds to columns in the CSV file.
    /// </summary>
    public class StoryMap : ClassMap<Story>
    {
        public StoryMap()
        {
            Map(s => s.ID);
            Map(s => s.Type);
            Map(s => s.State);
            Map(s => s.CreatedDate);
            Map(s => s.StartDate);
            Map(s => s.ClosedDate);
            Map(s => s.SprintNumberCreated);
            Map(s => s.SprintNumberStarted);
            Map(s => s.SprintNumberClosed);
            Map(s => s.DayInSprintClosed);
            Map(s => s.WeekCreated);
            Map(s => s.WeekStarted);
            Map(s => s.WeekClosed);
            Map(s => s.MonthCreated);
            Map(s => s.MonthStarted);
            Map(s => s.MonthClosed);
            Map(s => s.YearClosed);
            Map(s => s.LeadSprints);
            Map(s => s.CycleSprints);
            Map(s => s.LeadDays);
            Map(s => s.CycleDays);
            Map(s => s.LeadWeeks);
            Map(s => s.CycleWeeks);
            Map(s => s.LeadMonths);
            Map(s => s.CycleMonths);

            // Map Story-specific properties
            Map(s => s.FeatureID);
            Map(s => s.EstimatedEffort);
            Map(s => s.FeatureExists);
        }
    }
}
