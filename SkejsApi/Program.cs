namespace SkejsApi;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        app.MapGet("/", () => "Hello World!");
        app.UseHttpsRedirection();
        app.MapControllers();

        app.Run();
    }
}