using System.Diagnostics;
using backend.Models;


namespace backend.Services
{
    public  class Filter 
    {
        //date of the first Sprint
        public  DateOnly firstSprint = new DateOnly(2021, 12, 22); 

        //Gets the sprint number to the given date
        public int getSprintNumber(DateOnly date)
        {
            Debug.Assert(date >= firstSprint);

            int sprintNumber = 1; // Sprint number starts at 1
            DateOnly cur = firstSprint;

            while (date >= cur.AddDays(14)) 
            {
                cur = cur.AddDays(14);
                sprintNumber++;
            }

            return sprintNumber;
        }

        //Gets the Week number to the given date
        public  int getWeekNumber(DateOnly date) 
        {
            DateTime dateTime = date.ToDateTime(TimeOnly.MinValue);
            var calendar = System.Globalization.CultureInfo.InvariantCulture.Calendar;
            int weekOfYear = calendar.GetWeekOfYear(dateTime, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            if(weekOfYear > 1 || weekOfYear < 52) return weekOfYear+1;
            else
            return weekOfYear;
        }

        // Gets the Week-Year identifier for a given date
        public int GetWeekYear(DateOnly date)
        {
            DateTime dateTime = date.ToDateTime(TimeOnly.MinValue);
            var calendar = System.Globalization.CultureInfo.InvariantCulture.Calendar;
            int weekOfYear = calendar.GetWeekOfYear(dateTime, System.Globalization.CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            return weekOfYear;
        }

        

        //Gets the day number to the given date starting with sunday
        public  int getDayNumber(DateOnly date)
        {
            DayOfWeek dayOfWeek = date.DayOfWeek; 
            return (int)dayOfWeek == 0 ? 1 : (int)dayOfWeek + 1;
        }
        // creates the matrix for montecarlo sprint when given a sprintrange
        public  int[][] getHistoricalDataStoriesFromSprint (int startSprint, int endSprint, List<Story> items) 
        {
            ArgumentNullException.ThrowIfNull(items);
            int range = endSprint - startSprint + 1;
            int[][] result = new int[14][];
            for (int i = 0; i < 14; i++)
            {
                result[i] = new int[range]; 
            }
            foreach (var item in items) 
            {
                if (item.Type == "Story" && 
                    item.State == "Done" &&
                    item.SprintNumberClosed != -1 &&
                    item.SprintNumberClosed >= startSprint && 
                    item.SprintNumberClosed <= endSprint &&
                    item.DayInSprintClosed >= 1 &&
                    item.DayInSprintClosed <= 14) 
                    {
                        int sprintIndex = item.SprintNumberClosed - startSprint;
                        int dayIndex = item.DayInSprintClosed - 1;
                        result[dayIndex][sprintIndex] += 1;
                    }
            }
            return result;
        }
        // creates the matrix for montecarlo sprint when given a daterange
        public  int[][] getHistoricalDataStoriesFromDate (DateOnly startDate, DateOnly endDate, List<Story> items) 
        {
            ArgumentNullException.ThrowIfNull(items);
            int startSprint = getSprintNumber(startDate);
            int endSprint = getSprintNumber(endDate);
            return getHistoricalDataStoriesFromSprint(startSprint, endSprint, items);
        }

        // creates the matrix for montecarlo feature when given weekrange
        public int[][] getHistoricalDataFeaturesFromWeek(int startWeek, int endWeek, List<Story> items) 
        {
            ArgumentNullException.ThrowIfNull(items);
            int maxWeeksInYear = 53; 
            int range = endWeek >= startWeek? endWeek - startWeek + 1 : maxWeeksInYear - startWeek + endWeek +1;

            int[][] result = new int[7][];
            for (int i = 0; i < 7; i++)
            {
                result[i] = new int[range]; 
            }
            foreach (var item in items) 
            {
                if (item.Type == "Story" && 
                    item.State == "Done" &&
                    item.WeekClosed != -1 &&
                    item.WeekClosed >= startWeek && 
                    item.WeekClosed <= endWeek &&
                    item.ClosedDate.HasValue) 
                    {
                        int dayIndex = getDayNumber(item.ClosedDate.Value) - 1;
                        int sprintIndex = item.WeekClosed - startWeek;
                        result[dayIndex][sprintIndex] += 1;
                    }
            }
            return result;
        }

        //create the matrix for montecarlo feature when given a daterange
        public  int[][] getHistoricalDataFeaturesFromDate(DateOnly startDate, DateOnly endDate, List<Story> items) 
        {
            ArgumentNullException.ThrowIfNull(items);
            int startWeek = getWeekNumber(startDate);
            int endWeek = getWeekNumber(endDate);
            return getHistoricalDataFeaturesFromWeek(startWeek, endWeek, items);
        }

        //Converts int[][] to int[,]
        public int[,] convertTo2DArray(int[][] source)
        {
            // Überprüfen, ob das Eingabearray null oder leer ist
            if (source == null || source.Length == 0)
            {
                return new int[0, 0]; // Rückgabe eines leeren 2D-Arrays
            }

            // Anzahl der Zeilen und Spalten für das 2D-Array
            int rows = source.Length;
            int columns = source[0].Length;

            // Erstellen eines 2D-Arrays mit der gleichen Größe wie das Eingabearray
            int[,] result = new int[rows, columns];

            // Werte vom int[][] in int[,] kopieren
            for (int i = 0; i < rows; i++)
            {
                for (int j = 0; j < columns; j++)
                {
                    result[i, j] = source[i][j];
                }
            }

            return result;
        }



    }
}
