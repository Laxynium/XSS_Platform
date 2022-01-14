using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace XSSPlatform
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly TokenGenerator _tokenGenerator;
        private readonly IUserRepository _userRepository;
        private readonly LevelsOptions _levelsOptions;
        private readonly UserMapper _userMapper;

        public UsersController(TokenGenerator tokenGenerator, IUserRepository userRepository,
            LevelsOptions levelsOptions, UserMapper userMapper)
        {
            _tokenGenerator = tokenGenerator;
            _userRepository = userRepository;
            _levelsOptions = levelsOptions;
            _userMapper = userMapper;
        }

        public record RegisterUserRequest(string Name);

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> RegisterUser([FromBody] RegisterUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest();
            }

            var user = XSSPlatform.User.Create(request.Name, _tokenGenerator);

            _userRepository.Save(user);

            await AddAuthCookieToResponse(user);

            return Ok(_userMapper.ToDto(user));
        }

        public record CompleteLevelRequest(int Level, string LevelToken);

        [HttpPost("me/levels/complete")]
        [Authorize]
        public ActionResult<UserDto> CompleteLevel([FromBody] CompleteLevelRequest request)
        {
            var userId = HttpContext.User?.Identity?.Name;
            if (userId is null)
            {
                return NotFound();
            }

            var user = _userRepository.Get(userId);
            if (user is null)
            {
                return BadRequest();
            }
            
            var result = user.CompleteLevel(request.Level, request.LevelToken, _levelsOptions.Count, _tokenGenerator);
            if (!result)
            {
                return BadRequest();
            }
            
            _userRepository.Save(user);

            return Ok(_userMapper.ToDto(user));
        }

        public record UseHintRequest(int LevelNumber, string LevelToken, int HintNumber);

        [HttpPost("me/levels/use-hint")]
        [Authorize]
        public ActionResult<UserDto> UseHint([FromBody] UseHintRequest request)
        {
            var userId = HttpContext.User?.Identity?.Name;
            if (userId is null)
            {
                return NotFound();
            }

            var user = _userRepository.Get(userId);
            if (user is null)
            {
                return BadRequest();
            }

            var result = user.UseHint(request.LevelNumber, request.LevelToken, request.HintNumber,
                _levelsOptions.LevelsHints);

            if (!result)
            {
                return BadRequest();
            }
            
            _userRepository.Save(user);

            return Ok(_userMapper.ToDto(user));
        }

        [HttpGet("me")]
        [Authorize]
        public ActionResult<UserDto> Get()
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

            return Ok(user);
        }

        private async Task AddAuthCookieToResponse(User user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Id),
                new(ClaimTypes.NameIdentifier, user.Id),
                new("Name", user.Name),
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProps = new AuthenticationProperties
            {
                IsPersistent = true
            };

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProps);
        }
    }
}