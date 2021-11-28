using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace XSSPlatform
{
    [ApiController]
    [Route("[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public FilesController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        
        [HttpGet("{levelNumber}")]
        [Authorize]
        public IActionResult Get(int levelNumber)
        {
            var userId = HttpContext.User?.Identity?.Name;
            if (userId is null)
            {
                return NotFound();
            }

            var user = _userRepository.Get(userId);
            if (user is null)
            {
                return NotFound();
            }

            var level = user.Levels.Find(x => x.Number == levelNumber);
            if (level is null || level.Completed == false)
            {
                return NotFound();
            }

            var filePath = $"LevelsZips/level{level.Number}.zip";
            
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileStream = System.IO.File.Open(filePath, FileMode.Open);
            
            return File(fileStream, "application/octet-stream", $"level{level.Number}.zip");
        }
    }
}