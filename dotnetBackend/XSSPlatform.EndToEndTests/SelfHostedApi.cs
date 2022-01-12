using System;
using System.Collections.Concurrent;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Net.Http.Headers;

namespace XSSPlatform.EndToEndTests;

public sealed class FakeDatabase :
    ConcurrentDictionary<string, Collection<User>>, IUserRepository
{
    public User? Get(string userId) =>
        Values.SelectMany(us => us)
            .FirstOrDefault(u => u.Id == userId);

    public void Save(User user) =>
        AddOrUpdate(user.Id, new Collection<User> { user }, (_, us) =>
        {
            us.Add(user);
            return us;
        });
}

internal class CookiesContainerDelegateHandler : DelegatingHandler
{
    private readonly CookieContainer _cookieContainer = new();

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        var cookies = _cookieContainer.GetAllCookies();

        foreach (Cookie cookie in cookies)
        {
            var str = $"{cookie.Name}={cookie.Value}";
            request.Headers.Add(HeaderNames.Cookie, str);
        }

        var response = await base.SendAsync(request, cancellationToken);
        if (response.Headers.TryGetValues(HeaderNames.SetCookie, out var setCookieHeaders))
        {
            foreach (var header in setCookieHeaders)
            {
                _cookieContainer.SetCookies(
                    new Uri(response.RequestMessage.RequestUri.GetLeftPart(UriPartial.Authority)), header);
            }
        }

        return response;
    }
}

internal class SelfHostedApi : WebApplicationFactory<Program>
{
    public new HttpClient CreateClient()
        => CreateDefaultClient(new CookiesContainerDelegateHandler());

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<IUserRepository>();
            services.AddSingleton<IUserRepository>(new FakeDatabase());
        });
    }
}