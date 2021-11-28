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
        private readonly IUserMessagesRepository _userMessagesRepository;
        private readonly LevelsOptions _levelsOptions;
        private readonly UserMapper _userMapper;

        public UsersController(TokenGenerator tokenGenerator, IUserRepository userRepository,
            IUserMessagesRepository userMessagesRepository, LevelsOptions levelsOptions, UserMapper userMapper)
        {
            _tokenGenerator = tokenGenerator;
            _userRepository = userRepository;
            _userMessagesRepository = userMessagesRepository;
            _levelsOptions = levelsOptions;
            _userMapper = userMapper;
        }

        public record RegisterUserRequest(string Name);

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Action([FromBody] RegisterUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest();
            }

            var userId = _tokenGenerator.Generate();
            var levelToken = _tokenGenerator.Generate();

            var user = new User(userId, request.Name)
            {
                Levels = new List<Level> {new() {Number = 1, Completed = false, Token = levelToken}}
            };

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

            var level = user.FindLevel(request.Level, request.LevelToken);
            if (level is null)
            {
                return BadRequest();
            }

            user.CompleteLevel(level, _levelsOptions.Count);

            if (!user.ChallengeCompleted)
            {
                var levelToken = _tokenGenerator.Generate();
                user.AddNextLevel(level, levelToken);
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

            var level = user.FindLevel(request.LevelNumber, request.LevelToken);
            if (level is null)
            {
                return BadRequest();
            }

            if (!user.UseHint(level, request.HintNumber, _levelsOptions.LevelsHints))
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


        public record RequestMessage(string Content);

        [HttpPost("me/message")]
        [Authorize]
        public ActionResult<string[]> PostMessage([FromBody] RequestMessage requestMessage)
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

            var userMessagesOption = _userMessagesRepository.GetById(userId);
            _userMessagesRepository.Save(userMessagesOption.Match(
                userMessages => userMessages.AddMessage(requestMessage.Content),
                () => new UserMessages(userId, new List<string>(new []{requestMessage.Content}))));
            
            var resultUserMessages = _userMessagesRepository.GetById(userId);
            return resultUserMessages.Match<ActionResult>(userMessages => Ok(_userMapper.ToDto(userMessages.Messages)), NotFound);
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