using System;

public class Item {
    // ID of item 
    public int ID { get; set; }
    // type of item, either "feature" or "story", "bugs" are already ignored in the reading process
	public string Type { get; set; } = string.Empty;
    // states in which an item can be
    public string State { get; set; } = String.Empty;

    // dates when item was closed, started, and created
	public DateOnly CreatedDate { get; set; } 
	public DateOnly? StartDate { get; set; } 
	public DateOnly? ClosedDate { get; set; }

    // sprint number when item was closed, created and started (1-27 or -1 if invalid)
	public int SprintNumberCreated { get; set; } 
    public int SprintNumberStarted { get; set; } 
    public int SprintNumberClosed { get; set; } 

    // the day of the sprint when item waas closed (1-14 or -1 if invalid)
    public int DayInSprintClosed { get; set; } 

    // week when  item was created, started and closed (1-35 or -1 if invalid)
    public int WeekCreated { get; set; }
    public int WeekStarted { get; set; }
    public int WeekClosed { get; set; } 

    // month when item was created, started and date (1-12 or -1 if invalid)
    public int MonthCreated { get; set; }
    public int MonthStarted { get; set; }
    public int MonthClosed { get; set; } 

    // year when item was closed (-1 if invalid)
    public int YearClosed {get; set;} 
    
    // the difference between sprintNumberClosed and sprintNumberCreated, amount of sprints in lead time (-1 if invalid)
    public int LeadSprints { get; set; }
    // the difference between sprintNumberClosed and sprintNumberStarted, amount of sprints in cycle time (-1 if invalid)
    public int CycleSprints { get; set; }

    // the amount of days spent in lead time
    public int LeadDays { get; set; } 
    // the amount of days spent in cycle time
    public int CycleDays { get; set; } 

    // the amount of weeks spent in lead time
    public int LeadWeeks { get; set; } 
    // the amount of weeks spent in cycle time
    public int CycleWeeks { get; set; } 

    // the amount of months spent in lead time
    public int LeadMonths { get; set; }
    // the amount of months spent in cycle time
    public int CycleMonths { get; set; }

    public static string DetectDelimiter(string filepath){
        using var reader = new StreamReader(filepath);
        var firstLine = reader.ReadLine();
        if (firstLine != null && firstLine.Contains(';'))
        {
            return ";";
        }
        return ",";
    }
}
