# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopiere die Projektdateien und installiere Abhängigkeiten
COPY ["Backend.csproj", "./"]
RUN dotnet restore "Backend.csproj"

# Kopiere den Rest der App und baue sie
COPY . .
RUN dotnet publish "Backend.csproj" -c Release -o /app/publish

# Serve Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Kopiere die veröffentlichten Dateien
COPY --from=build /app/publish .

COPY data /app/data


# Exponiere den Port
EXPOSE 8080

# Starte die Anwendung
ENTRYPOINT ["dotnet", "Backend.dll"]

