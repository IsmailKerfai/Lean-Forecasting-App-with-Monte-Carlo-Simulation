using System;
using System.Collections.Generic;
using System.IO;
using CsvHelper; // Konsole: dotnet add package CsvHelper
using CsvHelper.Configuration;
using System.Globalization;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace backend.Models 
{
    public class Feature : Item {
    // a feature can be tagged with "maintenance"
    public string? Tag { get; set; }
    // number of items feature has
    public int NumOfChildItems { get; set;} 

    public static List<Feature> ReadFeatures(string filepath) {
        List<Feature> data = [];
        try {
            using (var reader = new StreamReader(filepath)) {
                var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture) {
                    Delimiter = DetectDelimiter(filepath)
                };
                using var csvReader = new CsvReader(reader, csvConfig);
                data = csvReader.GetRecords<Feature>().ToList();
            }
        } catch (Exception ex) {
            Console.WriteLine($"Fehler beim Lesen der Datei: {ex.Message}");
        }

        return data;
    }
    }      

}
