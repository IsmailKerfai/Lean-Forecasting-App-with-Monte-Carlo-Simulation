using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers{
	
	[ApiController]
	[Route("api/Cycle")]
	
	public class CycleController : ControllerBase{

		public static DateOnly? startDate_Stories = null;
		public static DateOnly? endDate_Stories = null;
		public static DateOnly? startDate_Features = null;
		public static DateOnly? endDate_Features = null;
		public static int value_Stories = 0;
		public static int value_Features = 0;

		// curl http://localhost:8080/api/Cycle/httpget:name

		[HttpGet("getstartDate_Stories")]
		public IActionResult getstartDate_Stories(){
			//Console.WriteLine($"startdatum Stories now : {startDate_Stories}");
			if(startDate_Stories.HasValue){
				string[] value = new string[1];
				value[0] = startDate_Stories.Value.ToString("yyyy-MM-dd");
				return Ok(value);
			}else{
				return Ok(null);
			}
		}
		
		[HttpGet("getendDate_Stories")]
		public IActionResult getendDate_Stories(){
			//Console.WriteLine($"enddatum Stories now : {endDate_Stories}");
			if(endDate_Stories.HasValue){
				string[] value = new string[1];
				value[0] = endDate_Stories.Value.ToString("yyyy-MM-dd");
				return Ok(value);
			}else{
				return Ok(null);
			}
		}
		
		[HttpGet("getstartDate_Features")]
		public IActionResult getstartDate_Features(){
			if(startDate_Features.HasValue){
				string[] value = new string[1];
				value[0] = startDate_Features.Value.ToString("yyyy-MM-dd");
				//Console.WriteLine($"startdatum Features now : {value[0]}");
				return Ok(value);
			}else{
				return Ok(null);
			}
		}
		
		[HttpGet("getendDate_Features")]
		public IActionResult getendDate_Features(){
			if(endDate_Features.HasValue){
				string[] value = new string[1];
				value[0] = endDate_Features.Value.ToString("yyyy-MM-dd");
				//Console.WriteLine($"enddatum Features now : {value[0]}");
				return Ok(value);
			}else{
				return Ok(null);
			}
		}



		//Send Datum Stories:


		[HttpGet("SendDate_Stories")]
		public IActionResult SendDate_Stories([FromQuery] DateTime Start, [FromQuery] DateTime End){
			//Console.WriteLine($"Received Start Stories: {Start}, End: {End}");
			//Console.WriteLine($"value now : {value_Stories}");
			if (Start == default || End == default){
        		return BadRequest("Start or End is missing.");
    		}
    		DateOnly? startDatetmp = startDate_Stories;
    		DateOnly? endDatetmp = endDate_Stories;
    		startDate_Stories = DateOnly.FromDateTime(Start);
    		endDate_Stories = DateOnly.FromDateTime(End);
			
			value_Stories = 1;
			if(startDate_Stories > endDate_Stories){
			 	value_Stories = 0;
			 	//Console.WriteLine($"Storie is bigger");
			 	startDate_Stories = startDatetmp;
			 	endDate_Stories = endDatetmp;
			}
			CycleFilter.CycleStories(GlobalDataStore.Stories, startDate_Stories, endDate_Stories);
			if(CycleFilter.isStoryEmpty() == 0){
				value_Stories = 0;
				//Console.WriteLine($"Storie is empty");
				startDate_Stories = startDatetmp;
			 	endDate_Stories = endDatetmp;
			}
			CycleFilter.CycleStories(GlobalDataStore.Stories, startDate_Stories, endDate_Stories);
			//Console.WriteLine($"value : {value_Stories}");
			return Ok(value_Stories);
		}
		
		[HttpGet("SendDate_Features")]
		public IActionResult SendDate_Features([FromQuery] DateTime Start, [FromQuery] DateTime End){
			//Console.WriteLine($"Received Start Features: {Start}, End: {End}");
			//Console.WriteLine($"value now : {value_Features}");
			if (Start == default || End == default){
        		return BadRequest("Start or End is missing.");
    		}
    		DateOnly? startDatetmp = startDate_Features;
    		DateOnly? endDatetmp = endDate_Features;
    		startDate_Features = DateOnly.FromDateTime(Start);
    		endDate_Features = DateOnly.FromDateTime(End);
			//Console.WriteLine($"vor if cases");
			value_Features = 1;
			if(startDate_Features > endDate_Features){
			 	value_Features = 0;
			 	//Console.WriteLine($"Feature is bigger");
			 	startDate_Features = startDatetmp;
			 	endDate_Features = endDatetmp;
			}
			//Console.WriteLine($"vor zweitem if cases");
			CycleFilter.CycleFeatures(GlobalDataStore.Features, startDate_Features, endDate_Features);
			if(CycleFilter.isFeatureEmpty() == 0){
				value_Features = 0;
				//Console.WriteLine($"Feature is empty");
				startDate_Features = startDatetmp;
			 	endDate_Features = endDatetmp;
			}
			CycleFilter.CycleFeatures(GlobalDataStore.Features, startDate_Features, endDate_Features);
			//Console.WriteLine($"value : {value_Features}");
			return Ok(value_Features);
		}

		
		//Graph1 -- Cycle Day - Stories //////////////////////////////////////////////////////////////////////////
		[HttpGet("SetxAchse_Cycle_Day_Stories")]
		//Benötigt einen String array für x-Achse. Ein element hier entspricht der x-Koordinate für den Punkt.
		//Das Datum MUSS dieses Format haben!!!!!
		public IActionResult SetxAchse_Cycle_Day_Stories(){
			//string[] xAchse = {"01/01/2023","01/01/2023", "02/03/2023", "03/04/2023",};
			//Console.WriteLine($"Received Start Stories in SetXAchse: {startDate}, End: {endDate}");
			CycleFilter.CycleStories(GlobalDataStore.Stories, startDate_Stories, endDate_Stories);
			string[] xAchse = CycleFilter.returnXAxis("story");
			return Ok(xAchse);
		}
		
		[HttpGet("SetyAchse_Cycle_Day_Stories")]
		//Benötigt einen Integer array für x-Achse. Ein element hier entspricht der y-Koordinate für den Punkt.
		public IActionResult SetyAchse_Cycle_Day_Stories(){
			double[] yAchse = CycleFilter.returnYAxis("story", "cycledays");
			//double[] yAchse = [1,2,3,4];
			return Ok(yAchse);
		}
		
		//85% Grenze
		[HttpGet("Cycle_Day_85_Stories")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Day_85_Stories(){
			double value = CycleFilter.Line85("story", "cycledays");
			//Console.WriteLine($"Received 85% Cycle Day Stories value: {value}");
			return Ok(value);
		}
		
		//50% Grenze
		[HttpGet("Cycle_Day_50_Stories")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Day_50_Stories(){
			double value = CycleFilter.Line50("story", "cycledays");
			//Console.WriteLine($"Received 50% Cycle Day Stories value: {value}");
			return Ok(value);
		}
		
		//Graph2 -- Lead Day - Stories //////////////////////////////////////////////////////////////////////////
		
		[HttpGet("SetxAchse_Lead_Day_Stories")]
		//Benötigt einen String array für x-Achse. Ein element hier entspricht der x-Koordinate für den Punkt.
		//Das Datum MUSS dieses Format haben!!!!!
		public IActionResult SetxAchse_Lead_Day_Stories(){
			string[] xAchse = CycleFilter.returnXAxis("story");
			return Ok(xAchse);
		}
		
		[HttpGet("SetyAchse_Lead_Day_Stories")]
		//Benötigt einen Integer array für x-Achse. Ein element hier entspricht der y-Koordinate für den Punkt.
		public IActionResult SetyAchse_Lead_Day_Stories(){
			double[] yAchse = CycleFilter.returnYAxis("story", "leaddays");
			return Ok(yAchse);
		}
		
		//85% Grenze
		[HttpGet("Lead_Day_85_Stories")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Lead_Day_85_Stories(){
			double value = CycleFilter.Line85("story", "leaddays");
			//Console.WriteLine($"Received 85% Lead Day Stories value: {value}");
			return Ok(value);
		}
		
		//50% Grenze
		[HttpGet("Lead_Day_50_Stories")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Lead_Day_50_Stories(){
			double value = CycleFilter.Line50("story", "leaddays");
			//Console.WriteLine($"Received 50% Lead Day Stories value: {value}");
			return Ok(value);
		}
		
		//Graph3 -- Cycle Efficiency - Stories //////////////////////////////////////////////////////////////////
		
		[HttpGet("SetxAchse_Cycle_Efficiency_Stories")]
		//Benötigt einen String array für x-Achse. Ein element hier entspricht der x-Koordinate für den Punkt.
		//Das Datum MUSS dieses Format haben!!!!!
		public IActionResult SetxAchse_Cycle_Efficiency_Stories(){
			string[] xAchse = CycleFilter.returnXAxis("story");
			return Ok(xAchse);
		}
		
		[HttpGet("SetyAchse_Cycle_Efficiency_Stories")]
		//Benötigt einen Integer array für x-Achse. Ein element hier entspricht der y-Koordinate für den Punkt.
		public IActionResult SetyAchse_Cycle_Efficiency_Stories(){
			double[] yAchse = CycleFilter.returnYAxis("story", "efficiency");
			return Ok(yAchse);
		}
		
		//50% Grenze
		[HttpGet("Cycle_Efficiency_50_Stories")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Efficiency_50_Stories(){
			double value = CycleFilter.Line50("story","efficiency");
			//Console.WriteLine($"Received 50% Cycle Efficiency Stories value: {value}");
			return Ok(value);
		}
		
		//85% Grenze
		[HttpGet("Cycle_Efficiency_85_Stories")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Efficiency_85_Stories(){
			double value = CycleFilter.Line85("story", "efficiency");
			//Console.WriteLine($"Received 85% Cycle Efficiency Stories value: {value}");
			return Ok(value);
		}
		
		
		
		
		//Ab hier Features!



		//Graph1 -- Cycle Day - Features //////////////////////////////////////////////////////////////////////////
		[HttpGet("SetxAchse_Cycle_Day_Features")]
		//Benötigt einen String array für x-Achse. Ein element hier entspricht der x-Koordinate für den Punkt.
		//Das Datum MUSS dieses Format haben!!!!!
		public IActionResult SetxAchse_Cycle_Day_Features(){
			CycleFilter.CycleFeatures(GlobalDataStore.Features, startDate_Features, endDate_Features);
			string[] xAchse = CycleFilter.returnXAxis("feature");
			return Ok(xAchse);
		}
		
		[HttpGet("SetyAchse_Cycle_Day_Features")]
		//Benötigt einen Integer array für x-Achse. Ein element hier entspricht der y-Koordinate für den Punkt.
		public IActionResult SetyAchse_Cycle_Day_Features(){
			double[] yAchse = CycleFilter.returnYAxis("feature", "cycledays");

			return Ok(yAchse);
		}
		
		//85% Grenze
		[HttpGet("Cycle_Day_85_Features")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Day_85_Features(){
			double value = CycleFilter.Line85("feature", "cycledays");
			//Console.WriteLine($"Received 85% Cycle Day Features value: {value}");
			return Ok(value);
		}
		
		//50% Grenze
		[HttpGet("Cycle_Day_50_Features")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Day_50_Features(){
			double value = CycleFilter.Line50("feature", "cycledays");
			//Console.WriteLine($"Received 50% Cycle Day Features value: {value}");
			return Ok(value);
		}
		
		//Graph2 -- Lead Day - Features //////////////////////////////////////////////////////////////////////////
		
		[HttpGet("SetxAchse_Lead_Day_Features")]
		//Benötigt einen String array für x-Achse. Ein element hier entspricht der x-Koordinate für den Punkt.
		//Das Datum MUSS dieses Format haben!!!!!
		public IActionResult SetxAchse_Lead_Day_Features(){
			string[] xAchse = CycleFilter.returnXAxis("feature");
			return Ok(xAchse);
		}
		
		[HttpGet("SetyAchse_Lead_Day_Features")]
		//Benötigt einen Integer array für x-Achse. Ein element hier entspricht der y-Koordinate für den Punkt.
		public IActionResult SetyAchse_Lead_Day_Features(){
			double[] yAchse = CycleFilter.returnYAxis("feature", "leaddays");
			return Ok(yAchse);
		}
		
		//85% Grenze
		[HttpGet("Lead_Day_85_Features")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Lead_Day_85_Features(){
			double value = CycleFilter.Line85("feature", "leaddays");
			//Console.WriteLine($"Received 85% Lead Day Features value: {value}");
			return Ok(value);
		}
		
		//50% Grenze
		[HttpGet("Lead_Day_50_Features")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Lead_Day_50_Features(){
			double value = CycleFilter.Line50("feature", "leaddays");
			//Console.WriteLine($"Received 50% Lead Day Features value: {value}");
			return Ok(value);
		}
		
		//Graph3 -- Cycle Efficiency - Features //////////////////////////////////////////////////////////////////
		
		[HttpGet("SetxAchse_Cycle_Efficiency_Features")]
		//Benötigt einen String array für x-Achse. Ein element hier entspricht der x-Koordinate für den Punkt.
		//Das Datum MUSS dieses Format haben!!!!!
		public IActionResult SetxAchse_Cycle_Efficiency_Features(){
			string[] xAchse = CycleFilter.returnXAxis("feature");
			return Ok(xAchse);
		}
		
		[HttpGet("SetyAchse_Cycle_Efficiency_Features")]
		//Benötigt einen Integer array für x-Achse. Ein element hier entspricht der y-Koordinate für den Punkt.
		public IActionResult SetyAchse_Cycle_Efficiency_Features(){
			double[] yAchse = CycleFilter.returnYAxis("feature", "efficiency");
			return Ok(yAchse);
		}
		
		//85% Grenze
		[HttpGet("Cycle_Efficiency_50_Features")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Efficiency_50_Features(){
			double value = CycleFilter.Line50("feature","efficiency");
			//Console.WriteLine($"Received 50% Cycle Efficiency Features value: {value}");
			return Ok(value);
		}
		
		//50% Grenze
		[HttpGet("Cycle_Efficiency_85_Features")]
		//Der Integer Wert hier representiert die Höhe auf der y-Achse im Graphen. 
		//Auf dieser wird eine horizontale Linie gezeichnet
		public IActionResult Cycle_Efficiency_85_Features(){
			double value = CycleFilter.Line85("feature", "efficiency");
			//Console.WriteLine($"Received 85% Cycle Efficiency Features value: {value}");
			return Ok(value);
		}
	}
}
