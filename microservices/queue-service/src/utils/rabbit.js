export const publish = async (channel, data) => {
    const exchange = 'ticket_exchange';
    const routingKey = data.service_tag;

    // Create exchange and queue if not already done
    await channel.assertExchange(exchange, 'direct', { durable: true });
    await channel.assertQueue(routingKey, { durable: true });
    await channel.bindQueue(routingKey, exchange, routingKey);

    // Publish the ticket message
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(data)),
      { persistent: true }
    );
}