using CsvHelper.Configuration;
using backend.Models;


namespace backend.CsvMappings
{

    /// <summary>
    /// A mapping configuration for the `Feature` model used by CsvHelper.
    /// Defines how each property of the `Feature` model corresponds to columns in the CSV file.
    /// </summary>
    public class FeatureMap : ClassMap<Feature>
    {
        public FeatureMap()
        {
            Map(f => f.ID);
            Map(f => f.Type);
            Map(f => f.State);
            Map(f => f.CreatedDate);
            Map(f => f.StartDate);
            Map(f => f.ClosedDate);
            Map(f => f.SprintNumberCreated);
            Map(f => f.SprintNumberStarted);
            Map(f => f.SprintNumberClosed);
            Map(f => f.DayInSprintClosed);
            Map(f => f.WeekCreated);
            Map(f => f.WeekStarted);
            Map(f => f.WeekClosed);
            Map(f => f.MonthCreated);
            Map(f => f.MonthStarted);
            Map(f => f.MonthClosed);
            Map(f => f.YearClosed);
            Map(f => f.LeadSprints);
            Map(f => f.CycleSprints);
            Map(f => f.LeadDays);
            Map(f => f.CycleDays);
            Map(f => f.LeadWeeks);
            Map(f => f.CycleWeeks);
            Map(f => f.LeadMonths);
            Map(f => f.CycleMonths);

            // Map Feature-specific properties
            Map(f => f.Tag);
            Map(f => f.NumOfChildItems);
        }
    }
}
