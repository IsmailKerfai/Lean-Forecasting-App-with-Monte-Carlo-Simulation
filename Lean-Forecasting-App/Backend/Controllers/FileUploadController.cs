    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.IO;
    using Microsoft.Extensions.Logging;


    using backend.Services;
    using backend.Models;

    [ApiController]
    [Route("api/[controller]")]

    public class FileUploadController : ControllerBase {
        private readonly ILogger<FileUploadController> _logger;

        public FileUploadController(ILogger<FileUploadController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Endpoint to upload a CSV file. The file is parsed, and features and stories are stored in a global data store.
        /// </summary>
        /// <param name="file">The uploaded file</param>
        /// <returns>An OkObjectResult with processing summary or a BadRequest/ServerError</returns>

        [HttpPost("Upload")]
        public IActionResult UploadFile(IFormFile file) {
            if (file == null || file.Length == 0) {
                return BadRequest("No file uploaded or file is empty.");
            }

            if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase)) {
                return BadRequest("Invalid file type. Please upload a CSV file.");
            }

            try {
                using var stream = file.OpenReadStream();
                DataService.ParseFile(stream);

                // Return updated list counts
                var result = new UploadResult {
                    Message = "Datei erfolgreich verarbeitet.",
                    TotalFeatures = GlobalDataStore.Features.Count,
                    TotalStories = GlobalDataStore.Stories.Count
                };
                return Ok(result);
                
            } catch (InvalidOperationException ex){
                return BadRequest(new
                    {
                        Message = "Invalid file.",
                        Hint = ex.Message
                    });
            } catch (Exception ex) {
                _logger?.LogError(ex, "An error occurred while processing the file.");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    /// <summary>
    /// Model to represent the result of the file upload process.
    /// </summary>
    public class UploadResult
    {
        public string? Message { get; set; }
        public int TotalFeatures { get; set; }
        public int TotalStories { get; set; }
    }
