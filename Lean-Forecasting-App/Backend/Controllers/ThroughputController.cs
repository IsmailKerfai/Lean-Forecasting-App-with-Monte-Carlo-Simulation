using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IO;

using backend.Services;
using backend.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.WebEncoders.Testing;


[ApiController]
[Route("api/[controller]")]
/// <summary>
/// Controller for handling throughput-related API operations.
/// </summary>
/// <remarks>
/// Author: Phuong Diem Quynh, Nguyen 
/// Author: Daniel Tverdunov 
/// </remarks>
public class ThroughputController : ControllerBase {
    private readonly ILogger<FileUploadController> _logger;
    /// <summary>
    /// Initializes a new instance of the <see cref="ThroughputController"/> class.
    /// </summary>
    /// <param name="logger">The logger instance for logging purposes.</param>
    public ThroughputController(ILogger<FileUploadController> logger)
    {
        _logger = logger;
    }
    /// <summary>
    /// Gets throughput data for all features grouped by months.
    /// </summary>
    /// <returns>A dictionary where keys are month numbers and values are the number of completed features.</returns>
    [HttpGet("Features_AllMonths")]
    public ActionResult GetFeatures_AllMonth()
    {
        var result = ThroughputFilter.ThroughputAllMonth(GlobalDataStore.Features);
        return Ok(result); // Return the list of all Features
    }
    /// <summary>
    /// Filters features by month range.
    /// </summary>
    /// <param name="start">The starting month number for filtering.</param>
    /// <param name="end">The ending month number for filtering.</param>
    /// <returns>
    /// A <see cref="ThroughputFilter.ThroughputSummary"/> object containing throughput by month, 
    /// 50% cumulative throughput, and 85% cumulative throughput.
    /// </returns>
    [HttpGet("filtering_Features_Month")]
    public ActionResult GetFeatures_Month(int start, int end)
    {
        ThroughputFilter.ThroughputSummary result;
        result = ThroughputFilter.FilterByMonth<Feature>(GlobalDataStore.Features, start, end);
        return Ok(result); // Return the list of all Features
    }
    /// <summary>
    /// Gets throughput data for all stories grouped by sprints.
    /// </summary>
    /// <returns>A dictionary where keys are sprint numbers and values are the number of completed stories.</returns>
    [HttpGet("Stories_AllSprints")]
    public ActionResult GetStories_AllSprints()
    {
        var result = ThroughputFilter.ThroughputAllSprints(GlobalDataStore.Stories);
        return Ok(result); // Return the list of all Features
    }
    /// <summary>
    /// Filters stories by sprint range.
    /// </summary>
    /// <param name="start">The starting sprint number for filtering.</param>
    /// <param name="end">The ending sprint number for filtering.</param>
    /// <returns>
    /// A <see cref="ThroughputFilter.ThroughputSummary"/> object containing throughput by sprint, 
    /// 50% cumulative throughput, and 85% cumulative throughput.
    /// </returns>
    [HttpGet("filtering_Stories_Sprint")]
    public ActionResult GetStories_Sprint(int start, int end)
    { 
        ThroughputFilter.ThroughputSummary result;

        result = ThroughputFilter.FilterBySprint<Story>(GlobalDataStore.Stories, start, end);
        return Ok(result); 
    }

}


   





