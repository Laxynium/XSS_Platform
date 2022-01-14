using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Xunit;

namespace XSSPlatform.UnitTests;

public class UseHintTests
{
    [Theory]
    [InlineData(-1)]
    [InlineData(0)]
    [InlineData(2)]
    public void Fails_when_level_number_is_invalid(int levelNumber)
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;
                
        var result = user.UseHint(levelNumber, lastLevelToken, 1, new Dictionary<string, string[]>
        {
            ["1"]=new[]{"Hint1","Hint2"},
        });
        
        result.Should().BeFalse();
    }

    [Fact]
    public void Fails_when_level_token_is_invalid()
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
                
        var result = user.UseHint(1, "invalid_token", 1, new Dictionary<string, string[]>
        {
            ["1"]=new[]{"Hint1","Hint2"},
        });
        
        result.Should().BeFalse();
    }

    [Fact]
    public void Fails_when_there_is_no_hint_for_given_level()
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;
                
        var result = user.UseHint(1, lastLevelToken, 1, new Dictionary<string, string[]>());
        
        result.Should().BeFalse();
    }
    
    [Theory]
    [InlineData(-1)]
    [InlineData(0)]
    [InlineData(2)]
    public void Fails_when_hint_number_is_valid(int hintNumber)
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;
                        
        var result = user.UseHint(1, lastLevelToken, hintNumber, new Dictionary<string, string[]>
        {
            ["1"]=new[]{"Hint1"},
        });
        
        result.Should().BeFalse();
    }
    
    [Fact]
    public void Next_hint_cannot_be_used_when_previous_is_not_used()
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;
                        
        var result = user.UseHint(1, lastLevelToken, 2, new Dictionary<string, string[]>
        {
            ["1"]=new[]{"Hint1","Hint2"},
        });
        
        result.Should().BeFalse();
    }

    [Fact]
    public void Hint_is_used_correctly()
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;
                        
        var result = user.UseHint(1, lastLevelToken, 1, new Dictionary<string, string[]>
        {
            ["1"]=new[]{"Hint1"},
        });
        
        result.Should().BeTrue();
        user.Levels.Should().SatisfyRespectively(l =>
        {
            l.Completed.Should().BeFalse();
            l.UsedHints.Should().SatisfyRespectively(h =>
            {
                h.Should().Be(1);
            });
        });
    }
    
}