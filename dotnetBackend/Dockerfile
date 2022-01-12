# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY XSSPlatform/*.csproj ./XSSPlatform/
RUN dotnet restore XSSPlatform/*.csproj

# copy everything else and build app
COPY XSSPlatform/. ./XSSPlatform/
WORKDIR /source/XSSPlatform
RUN dotnet publish *.csproj -c release -o /app

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "XSSPlatform.dll"]