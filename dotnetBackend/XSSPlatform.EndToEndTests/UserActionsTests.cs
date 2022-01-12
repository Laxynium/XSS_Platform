using System.Linq;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;

namespace XSSPlatform.EndToEndTests;

public class UserActionsTests
{
    [Fact]
    public async Task RegisterUser()
    {
        using var api = new SelfHostedApi();
        using var client = api.CreateClient();

        var response = await client.RegisterUser("User1");

        response.EnsureSuccessStatusCode();
        var content = await response.ParseJsonContent<UserDto>();
        content.Id.Should().HaveLength(32);
        content.Name.Should().Be("User1");
        content.ChallengeCompleted.Should().Be(false);
        content.Levels.Should().SatisfyRespectively(l =>
        {
            l.Number.Should().Be(1);
            l.Completed.Should().BeFalse();
            l.UsedHints.Should().BeEmpty();
            l.Token.Should().HaveLength(32);
        });
    }
    
    [Fact]
    public async Task GetMe()
    {
        using var api = new SelfHostedApi();
        using var client = api.CreateClient();
        
        var registerUserResponse = await client.RegisterUser("User1");
        registerUserResponse.EnsureSuccessStatusCode();

        var meResponse = await client.GetMe();
        
        meResponse.EnsureSuccessStatusCode();
        var content = await meResponse.ParseJsonContent<UserDto>();
        content.Id.Should().HaveLength(32);
        content.Name.Should().Be("User1");
        content.ChallengeCompleted.Should().Be(false);
        content.Levels.Should().SatisfyRespectively(l =>
        {
            l.Number.Should().Be(1);
            l.Completed.Should().BeFalse();
            l.UsedHints.Should().BeEmpty();
            l.Token.Should().HaveLength(32);
        });
    }

    [Fact]
    public async Task CompleteLevel()
    {
        using var api = new SelfHostedApi();
        using var client = api.CreateClient();
        
        var registerUserResponse = await client.RegisterUser("User1");
        registerUserResponse.EnsureSuccessStatusCode();
        var user = await registerUserResponse.ParseJsonContent<UserDto>();

        var level = user.Levels.Last();

        var completeLevelResponse = await client.CompleteLevel(new { level = level.Number, levelToken = level.Token });
        completeLevelResponse.EnsureSuccessStatusCode();
        var updatedUser = await completeLevelResponse.ParseJsonContent<UserDto>();
        updatedUser.Levels.Should().SatisfyRespectively(l =>
        {
            l.Number.Should().Be(1);
            l.Completed.Should().Be(true);
            l.UsedHints.Should().BeEmpty();
        }, l =>
        {
            l.Number.Should().Be(2);
            l.Completed.Should().Be(false);
            l.UsedHints.Should().BeEmpty();
        });
    }

    [Fact]
    public async Task UseHint()
    {
        using var api = new SelfHostedApi();
        using var client = api.CreateClient();
        
        var registerUserResponse = await client.RegisterUser("User1");
        registerUserResponse.EnsureSuccessStatusCode();
        var user = await registerUserResponse.ParseJsonContent<UserDto>();
        var level = user.Levels.Last();

        var response = await client.UseHint(new { levelNumber = level.Number, levelToken = level.Token, hintNumber = 1 });
        response.EnsureSuccessStatusCode();
        var updatedUser = await response.ParseJsonContent<UserDto>();
        updatedUser.Levels.Should().SatisfyRespectively(l =>
        {
            l.Number.Should().Be(1);
            l.Completed.Should().Be(false);
            l.UsedHints.Should().SatisfyRespectively(h =>
            {
                h.Number.Should().Be(1);
                h.Value.Should().NotBeNull();
            });
        });
    }
    
}