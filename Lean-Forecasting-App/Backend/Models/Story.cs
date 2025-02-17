using System;
using System.Collections.Generic;
using System.IO;
using CsvHelper; // Konsole: dotnet add package CsvHelper
using System.Globalization;
using System.Linq;
using CsvHelper.Configuration;

namespace backend.Models
{


    // enum for all possible states a story can have
    public enum StoryState {
        New, 
        Approved,
        Commited,
        Resolved,
        WorkDone,
        Done,
    }

    public class Story : Item {
        // the id of the belonging feature
        public int FeatureID { get; set; }
        // estimated effort in hours
        public int? EstimatedEffort;
        // test flag whether story has feature
        public bool FeatureExists {get; set;}

        public static List<Story> ReadStories(string filepath) {
            List<Story> stories  = [];
            try {

                using var reader = new StreamReader(filepath);
                var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    Delimiter = DetectDelimiter(filepath),
                    HasHeaderRecord = true,
                    MissingFieldFound = null 
                };

                using var csvReader = new CsvReader(reader, csvConfig);

                csvReader.Read();
                csvReader.ReadHeader();

                while (csvReader.Read())
                {
                    // Check the type field in the CSV row
                    var type = csvReader.GetField("Type");
                    if (string.Equals(type, "Story", StringComparison.OrdinalIgnoreCase))
                    {
                        // If the row is of type Story, parse it and add to the list
                        var story = csvReader.GetRecord<Story>();
                        stories.Add(story);
                    }
                }


            } catch (Exception ex) {
                Console.WriteLine($"Fehler beim Lesen der Datei: {ex.Message}");
            }
            return stories;
        }
    }
}