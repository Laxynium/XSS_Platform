using FluentAssertions;
using Xunit;

namespace XSSPlatform.UnitTests;

public class CreateUserTests
{
    [Fact]
    public void User_is_created_correctly()
    {
        var generator = new TokenGenerator(new RandomStringGenerator());

        var user = User.Create("Test1", generator);

        user.Id.Should().HaveLength(32);
        user.Name.Should().Be("Test1");
        user.Levels.Should().SatisfyRespectively(l =>
        {
            l.Number.Should().Be(1);
            l.Completed.Should().Be(false);
            l.UsedHints.Should().BeEmpty();
            l.Token.Should().HaveLength(32);
        });
    }
}