using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;
using System.Collections.Concurrent;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonteCarloController : ControllerBase
    {
        private readonly MonteCarloStoriesService _storiesService;
        private readonly MonteCarloFeaturesService _featuresService;
        private readonly Filter _filterService;

        private static ConcurrentDictionary<string, List<int>> _cachedStoriesSimulation = new();
        private static ConcurrentDictionary<string,FeaturesSimulationResult> _cachedFeaturesSimulation = new();

        public MonteCarloController(MonteCarloStoriesService storiesService, MonteCarloFeaturesService featuresService, Filter filterService)
        {
            _storiesService = storiesService;
            _featuresService = featuresService;
            _filterService = filterService;
        }

        /// <summary>
        /// Runs initial Monte Carlo simulation for stories and returns simulation results
        /// </summary>
        [HttpGet("RunStoriesSimulation")]
        public IActionResult RunStoriesSimulation(
            DateOnly startDateData = default,
            DateOnly endDateData = default,
            int iterations = 5000)
        {
            try
            {


                DateOnly limitStartDate = new DateOnly(2021, 12, 22);
                DateOnly limitEndDate = new DateOnly(2023, 01, 03);

                if (startDateData == default ||  startDateData < limitStartDate)
                {
                    startDateData = limitStartDate;
                }
                if (endDateData == default || endDateData > limitEndDate)
                {
                    endDateData = limitEndDate;
                }

                

                var historicalData = _filterService.getHistoricalDataStoriesFromDate(startDateData, endDateData, GlobalDataStore.Stories);
                var simulationResults = MonteCarloSimulationUtils.RunSimulation(
                    _filterService.convertTo2DArray(historicalData), 
                    iterations
                );

                // Store simulation results with a unique key based on input parameters
                string simulationKey = $"{startDateData}_{endDateData}_{iterations}";
                _cachedStoriesSimulation[simulationKey] = simulationResults;

                return Ok(new 
                { 
                    SimulationKey = simulationKey, 
                    SimulationResults = simulationResults 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Runs initial Monte Carlo simulation for stories and returns simulation results
        /// </summary>

        [HttpGet("RunFeaturesSimulation")]
        public IActionResult RunFeaturesSimulation(
            DateOnly startDateData = default,
            DateOnly endDateData = default,
            int iterations = 5000)
        {
            try
            {

                var (earliest, latest) = DataService.GetDateRange();

                if (startDateData == default ||  startDateData < earliest)
                {
                    startDateData = earliest!.Value;
                }
                if (endDateData == default || endDateData > latest)
                {
                    endDateData = latest!.Value;
                }

                var historicalData = _filterService.getHistoricalDataFeaturesFromDate(startDateData, endDateData, GlobalDataStore.Stories);
                var childrenData = _featuresService.GetListOfNumOfChildItems(startDateData, endDateData);

                var simulationResults = MonteCarloSimulationUtils.RunSimulation(
                    _filterService.convertTo2DArray(historicalData), 
                    iterations
                );

                // Store simulation results with a unique key based on input parameters
                string simulationKey = $"{startDateData}_{endDateData}_{iterations}";
                _cachedFeaturesSimulation[simulationKey] = new FeaturesSimulationResult
                {
                    SimulationResults = simulationResults,
                    ChildrenData = childrenData
                };

                return Ok(new 
                { 
                    SimulationKey = simulationKey, 
                    ChildrenResults = childrenData,
                    SimulationResults = simulationResults
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Simulates story end date using cached simulation results
        /// </summary>
        [HttpGet("SimulateStoryEndDate")]
        public IActionResult SimulateStoryEndDate(
            string simulationKey,
            DateOnly? startDate,
            int storyTarget)
        {
            try
            {
                if (!_cachedStoriesSimulation.TryGetValue(simulationKey, out var simulationResults))
                {
                    return BadRequest("No cached simulation found. Run simulation first.");
                }

                var actualStartDate = startDate ?? new DateOnly(2024, 11, 22);
                
                // Create a copy of cached results to sort for percentile calculations
                var sortedResults = new List<int>(simulationResults);
                sortedResults.Sort();

                var result = _storiesService.CalculateStoryEndDateWithPrecomputedSimulation(
                    actualStartDate, 
                    storyTarget, 
                    sortedResults
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        /// <summary>
        /// Simulates story count using cached simulation results
        /// </summary>
        
        [HttpGet("SimulateStoryCount")]
        public IActionResult SimulateStoryCount(
            string simulationKey,
            DateOnly? startDate,
            DateOnly endDate)
        {
            try
            {
                if (!_cachedStoriesSimulation.TryGetValue(simulationKey, out var simulationResults))
                {
                    return BadRequest("No cached simulation found. Run simulation first.");
                }

                var actualStartDate = startDate ?? new DateOnly(2024, 11, 22);
                
                // Create a copy of cached results to sort for percentile calculations
                var sortedResults = new List<int>(simulationResults);
                sortedResults.Sort();

                var result = _storiesService.CalculateNumberOfStoriesWithPrecomputedSimulation(
                    actualStartDate, 
                    endDate, 
                    sortedResults
                );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }





        /// <summary>
        /// Simulates Feature count using cached simulation results
        /// </summary>
        
        [HttpGet("SimulateFeatureCount")]
        public IActionResult SimulateFeatureCount(
            string simulationKey,
            DateOnly? startDate,
            DateOnly endDate)
        {
            try
            {
                if (_cachedFeaturesSimulation.TryGetValue(simulationKey, out var cachedData))
                {
                    var simulationResults = cachedData.SimulationResults;
                    var childrenData = cachedData.ChildrenData;
                     var actualStartDate = startDate ?? new DateOnly(2025, 01, 01);
                
                    // Create a copy of cached results to sort for percentile calculations
                    var sortedResults = new List<int>(simulationResults);
                    var sortedChildren = new List<int>(childrenData);
                    sortedResults.Sort();
                    sortedChildren.Sort();
                    var result = _featuresService.CalculateNumberOfFeaturesWithPrecomputedSimulation(
                    actualStartDate, 
                    endDate, 
                    sortedResults,
                    sortedChildren
                    );
                    return Ok(result);
                }
                else
                {
                    return BadRequest("No cached simulation found. Run simulation first.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        /// <summary>
        /// Simulates Feature enddate using cached simulation results
        /// </summary>
        
        [HttpGet("SimulateFeatureEndDate")]
        public IActionResult SimulateFeatureEndDate(
            string simulationKey,
            DateOnly? startDate,
            int FeatureTarget)
        {
            try
            {
                if (_cachedFeaturesSimulation.TryGetValue(simulationKey, out var cachedData))
                {
                    var simulationResults = cachedData.SimulationResults;
                    var childrenData = cachedData.ChildrenData;
                     var actualStartDate = startDate ?? new DateOnly(2025, 01, 01);
                
                    // Create a copy of cached results to sort for percentile calculations
                    var sortedResults = new List<int>(simulationResults);
                    var sortedChildren = new List<int>(childrenData);
                    sortedResults.Sort();
                    sortedChildren.Sort();
                    var result = _featuresService.CalculateFeatureEndDateWithPrecomputedSimulation(
                        actualStartDate, 
                        FeatureTarget, 
                        sortedResults,
                        sortedChildren
                        );
                    return Ok(result);
                }
                else
                {
                    return BadRequest("No cached simulation found. Run simulation first.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves a histogram of story simulation results based on the provided simulation key.
        /// </summary>
        [HttpGet("GetStoriesHistogram")]
        public IActionResult GetStoriesHistogram(string simulationKey)
        {
            try
            {
                if (!_cachedStoriesSimulation.TryGetValue(simulationKey, out var simulationResults))
                {
                    return BadRequest("No cached simulation found. Run simulation first.");
                }

                var histogram = MonteCarloSimulationUtils.CalculateHistogram(simulationResults, 30);

                return Ok(histogram);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Retrieves a histogram of feature simulation results based on the provided simulation key.
        /// </summary>

        [HttpGet("GetFeaturesHistogram")]
        public IActionResult GetFeaturesHistogram(string simulationKey)
        {
            try
            {
                if (!_cachedFeaturesSimulation.TryGetValue(simulationKey, out var cachedData))
                {
                    return BadRequest("No cached simulation found. Run simulation first.");
                }

                var simulationResults = cachedData.SimulationResults;

                // Calculate histogram data
                var histogram = MonteCarloSimulationUtils.CalculateHistogram(simulationResults, 30);

                return Ok(histogram);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


    }


    /// <summary>
    /// Represents the result of a features simulation, including the simulation results and child data.
    /// </summary>
    public class FeaturesSimulationResult
    {
        public required List<int>  SimulationResults  { get; set; }
        public required List<int> ChildrenData { get; set; }
    }
}
