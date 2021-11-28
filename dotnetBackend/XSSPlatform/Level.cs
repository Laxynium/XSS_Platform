namespace XSSPlatform
{
    public record Level
    {
        public int Number { get; init; }
        public bool Completed { get; init; }
        public string Token { get; init; }
        public int[] UsedHints { get; init; } = { };
    }
}