using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using backend.Models;
using backend.CsvMappings;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace backend.Services
{
    public class DataService {

        /// <summary>
        /// Parses a CSV file from a stream, identifying and categorizing records as Features or Stories.
        /// </summary>
        /// <param name="csvStream">The stream containing the CSV data.</param>
        public static void ParseFile (Stream csvStream){


            List<Story> stories = [];
            List<Feature> features = [];

            try{
                var delimiter = DetectDelimiter(csvStream);
                csvStream.Seek(0, SeekOrigin.Begin);

                using var reader = new StreamReader(csvStream);
                var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture){
                    Delimiter = delimiter,        // Set the detected delimiter
                    HasHeaderRecord = true,       // Expect a header record in the CSV
                    MissingFieldFound = null      // Ignore missing fields without throwing an error
                };

                using var csvReader = new CsvReader(reader, csvConfig);

                csvReader.Read();
                csvReader.ReadHeader();
                var headers = csvReader.HeaderRecord ?? throw new InvalidOperationException("Die CSV-Datei enthält keine Kopfzeile oder die Kopfzeile konnte nicht gelesen werden.");

                string[] requiredHeaders = { "ID", "Type", "State", "CreatedDate", "StartDate", "ClosedDate", 
                                                "SprintNumberCreated", "SprintNumberStarted", "SprintNumberClosed", "DayInSprintClosed", "WeekCreated",
                                                "WeekStarted","WeekClosed","MonthCreated","MonthStarted","MonthClosed","YearClosed","LeadSprints",
                                                "CycleSprints","LeadDays","CycleDays", "LeadWeeks", "CycleWeeks", "LeadMonths","CycleMonths" }; 

                var missingHeaders = requiredHeaders.Where(header => !headers.Contains(header)).ToList();

                if (missingHeaders.Any())
                {
                    throw new InvalidOperationException($"The CSV file must contain the following columns: {string.Join(", ", missingHeaders)}");
                }

                csvReader.Context.RegisterClassMap<FeatureMap>();
                csvReader.Context.RegisterClassMap<StoryMap>();

                bool containsFeatures = false;
                bool containsStories = false;

                while (csvReader.Read()) {
                    var type = csvReader.GetField("Type");

                    if (string.Equals(type, "Feature", StringComparison.OrdinalIgnoreCase))
                    {
                        containsFeatures = true;
                        var feature = csvReader.GetRecord<Feature>();
                        features.Add(feature);
                    }
                    else if (string.Equals(type, "Story", StringComparison.OrdinalIgnoreCase))
                    {
                        containsStories = true;
                        var story = csvReader.GetRecord<Story>();
                        stories.Add(story);
                    }

                    if (containsFeatures && containsStories)
                    {
                        throw new InvalidOperationException("The CSV file contains both Features and Stories. Only one type of record is allowed per file.");
                    }
                }

                if (containsFeatures)
                {
                    GlobalDataStore.Features.Clear();
                    GlobalDataStore.Features.AddRange(features);
                }

                if (containsStories)
                {
                    GlobalDataStore.Stories.Clear();
                    GlobalDataStore.Stories.AddRange(stories);
                }

            } catch(Exception e){
                Console.WriteLine($"Error parsing file: {e.Message}");
                throw;
            }
        }   

        /// <summary>
        /// Detects the delimiter used in the CSV file by analyzing the first line.
        /// </summary>
        private static string DetectDelimiter(Stream csvStream){
            using var reader = new StreamReader(csvStream, leaveOpen: true);
            var firstLine = reader.ReadLine();
            csvStream.Seek(0, SeekOrigin.Begin);

            if (firstLine != null && firstLine.Contains(';'))
            {
                return ";";
            }
            return ",";
        }
        /// <summary>
        /// Finds the earliest and latest ClosedDate in the Features and Stories.
        /// </summary>
        /// <returns>A tuple with the earliest and latest ClosedDate.</returns>
        public static (DateOnly? earliestDate, DateOnly? latestDate) GetDateRange()
        {
            var closedDates = GlobalDataStore.Stories
                .Where( f=> f.Type == "Story")
                .Select(f => f.ClosedDate)
                .Where(date => date.HasValue) 
                .Select(date => date!.Value)  
                .ToList();

            if (!closedDates.Any())
            {
                return (null, null); 
            }

            var earliestDate = closedDates.Min();
            var latestDate = closedDates.Max();

            return (earliestDate, latestDate);
        }
    }
}