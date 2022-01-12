using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace XSSPlatform.EndToEndTests;

internal static class Content
{
    public static async Task<T> ParseJsonContent<T>(
        this HttpResponseMessage msg)
    {
        var json = await msg.Content.ReadAsStringAsync();
        var dto = JsonSerializer.Deserialize<T>(
            json,
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                PropertyNameCaseInsensitive = true
            });
        return dto;
    }
}

internal static class ApiClient
{
    internal static async Task<HttpResponseMessage> RegisterUser(
        this HttpClient client, string name)
    {
        var json = JsonSerializer.Serialize(new { name = name });
        using var content = new StringContent(json);
        content.Headers.ContentType!.MediaType = "application/json";

        var respoonse = await client.PostAsync(new Uri("Users/register", UriKind.Relative),
            content);

        return respoonse;
    }

    internal static async Task<HttpResponseMessage> GetMe(
        this HttpClient client)
    {
        var response = await client.GetAsync(new Uri("Users/me", UriKind.Relative));
        return response;
    }
    
    internal static async Task<HttpResponseMessage> CompleteLevel(
        this HttpClient client, object levelData)
    {
        var json = JsonSerializer.Serialize(levelData);
        using var content = new StringContent(json);
        content.Headers.ContentType!.MediaType = "application/json";
        
        var response = await client.PostAsync(new Uri("Users/me/levels/complete", UriKind.Relative), content);
        return response;
    }
    
    internal static async Task<HttpResponseMessage> UseHint(
        this HttpClient client, object useHintData)
    {
        var json = JsonSerializer.Serialize(useHintData);
        using var content = new StringContent(json);
        content.Headers.ContentType!.MediaType = "application/json";
        
        var response = await client.PostAsync(new Uri("Users/me/levels/use-hint", UriKind.Relative), content);
        return response;
    }

}