public class Message
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public string Content { get; set; } = null!;
    public DateTime Timestamp { get; set; }

    public Account? Sender { get; set; }
    public Account? Receiver { get; set; }
}
