using System.Linq;
using FluentAssertions;
using Xunit;

namespace XSSPlatform.UnitTests;

public class CompleteLevelTests
{

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(2)]
    public void Fails_when_level_number_is_invalid(int levelNumber)
    {
        var levelsCount = 1;
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;
        
        var result = user.CompleteLevel(levelNumber, lastLevelToken, levelsCount, generator);
        
        result.Should().BeFalse();
    }

    [Fact]
    public void Fails_when_level_token_is_invalid()
    {
        var levelsCount = 1;
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);

        var result = user.CompleteLevel(1, "wrong_token", levelsCount, generator);
        
        result.Should().BeFalse();
    }

    [Fact]
    public void Fails_when_completing_already_completed_level()
    {
        var levelsCount = 2;
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;
        
        user.CompleteLevel(1, lastLevelToken, levelsCount, generator);

        var result = user.CompleteLevel(1, lastLevelToken, levelsCount, generator);
        
        result.Should().BeFalse();
    }
    
    [Fact]
    public void Challenge_is_completed_when_last_level_was_completed()
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;

        var result = user.CompleteLevel(1, lastLevelToken, 1, generator);

        result.Should().BeTrue();
        user.Levels.Should().SatisfyRespectively(l =>
        {
            l.Completed.Should().BeTrue();
            l.UsedHints.Should().BeEmpty();
        });
        user.ChallengeCompleted.Should().BeTrue();
    }

    [Fact]
    public void Next_level_is_added_when_completed_level_is_not_last_one()
    {
        var generator = new TokenGenerator(new RandomStringGenerator());
        var user = User.Create("Test1", generator);
        var lastLevelToken = user.Levels.Last().Token;

        var result = user.CompleteLevel(1, lastLevelToken, 2, generator);

        result.Should().BeTrue();
        user.Levels.Should().SatisfyRespectively(l =>
        {
            l.Completed.Should().BeTrue();
            l.Number.Should().Be(1);
            l.UsedHints.Should().BeEmpty();
        }, l =>
        {
            l.Completed.Should().BeFalse();
            l.Number.Should().Be(2);
            l.UsedHints.Should().BeEmpty();
            l.Token.Should().HaveLength(32);
        });
        user.ChallengeCompleted.Should().BeFalse();
    }
}