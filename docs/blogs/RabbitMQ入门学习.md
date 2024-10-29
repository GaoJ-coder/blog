---
title: RabbitMQ入门学习
author: GaoJ
createTime: 2024/10/29 21:32:50
permalink: /article/ok1xmz3y/
---

# RabbitMQ 学习使用

> RabbitMQ 是一个开源的消息代理软件（Message Broker），广泛应用于分布式系统中，用来传递消息并解耦应用组件。它使用高级消息队列协议（AMQP，Advanced Message Queuing Protocol）来实现消息的发送、存储、路由和接收。以下是对 RabbitMQ 的详细介绍：


## 安装

```shell
docker run -p 5672:5672 -p 15672:15672 --name rabbitmq \
-d --restart=always rabbitmq:3.9-management
```

## RabbitMQ 基础概念
### 消息代理 (Message Broker)
RabbitMQ 作为消息代理，主要负责接收、存储和转发消息。它在消息的生产者（Publisher）和消费者（Consumer）之间充当中介，使得两者可以异步通信，即使生产者和消费者的处理速度不同步。

### 消息 (Message)

消息是由消息内容（payload）和消息元数据（如消息属性）组成的数据单元。RabbitMQ 处理的基本单位就是消息。

### 生产者 (Producer)

生产者是负责向 RabbitMQ 发送消息的应用或组件。生产者将消息发送到指定的交换机（Exchange），由交换机来决定如何路由消息。

### 消费者 (Consumer)

消费者是从 RabbitMQ 中接收和处理消息的应用或组件。消费者从队列（Queue）中提取消息进行处理。

### 交换机 (Exchange)

交换机是 RabbitMQ 中的核心组件之一，负责根据绑定规则将消息路由到一个或多个队列。交换机本身不存储消息。RabbitMQ 提供了几种不同类型的交换机：

- Direct Exchange：根据消息的路由键（Routing Key）将消息发送到与该键完全匹配的队列。
- Fanout Exchange：将消息广播到所有绑定到该交换机的队列，不考虑路由键。
- Topic Exchange：根据消息的路由键模式（可以使用通配符）将消息发送到符合条件的队列。
- Headers Exchange：根据消息的头属性进行路由，而不是路由键。

### 队列 (Queue)

队列是 RabbitMQ 中用来存储消息的容器。消费者从队列中接收消息。队列与交换机绑定，以便交换机能够将消息路由到队列。

#### 队列特性

##### 持久化

队列持久化是指将队列及其内容存储在磁盘上，以确保在服务器重启或发生故障时，队列和消息不会丢失。

- 持久化队列：将队列声明为持久化队列，以确保队列的元数据在服务器重启后仍然存在。

```java
    @Bean
    public Queue durableQueue(){
        return new Queue("durable,queue",true);
    }
```

- 持久化消息

```java
public void sendPersistentMessage(){
    String messageContent = "hello,world";
    // 创建消息属性并设置为持久化
    MessageProperties messageProperties = new MessageProperties();
    messageProperties.setDeliveryMode(MessageDeliveryMode.PERSISTENT);

    Message message = new Message(messageContent.getBytes(), messageProperties);
    rabbitTemplate.send(message);
}
```

##### 排他性

队列的排他性指队列只能由创建它的连接使用，其他连接无法访问或者声明该队列。当链接关闭时，队列自动删除。这种队列常用于临时数据处理，单个客户端的专用消息队列等

```java
 @Bean
    public Queue exclusiveQueue(){
        return new Queue(
                "exclusive.queue", // 队列名称
                true, // 是否持久化
                true, // 是否排他
                false // 是否自动删除
        );
    }
```

##### 自动删除

当最后一个绑定到该队列的消费者断开连接时，队列会自动删除。适用于临时任务或短期任务，避免手动清理未使用的队列。

```java
    @Bean
    public Queue autoDeleteQueue(){
        return new Queue(
                "autoDelete.queue",
                true,// 是否持久化
                false, // 是否排他
                true // 是否自动删除
        );
    }
```



### 绑定 (Binding)

绑定定义了交换机和队列之间的关系。绑定决定了交换机如何根据路由键将消息路由到队列。

### 路由键 (Routing Key)

路由键是用于确定消息应该被路由到哪个队列的字符串。在 Direct 和 Topic 类型的交换机中，路由键起到关键作用。

### 虚拟主机 (Virtual Host, vHost)

虚拟主机是 RabbitMQ 中的多租户机制，允许在一个 RabbitMQ 实例中隔离多个独立的逻辑组。每个 vHost 可以有自己的队列、交换机和绑定规则。

### 连接 (Connection) 和 信道 (Channel)

- 连接：一个物理 TCP 连接，连接到 RabbitMQ 服务器。

- 信道：在一个 TCP 连接内的逻辑通信路径。由于创建和销毁信道比连接的代价低得多，所以应用通常会复用一个连接并通过多个信道来发送和接收消息。

## RabbitMQ 工作原理

1. 生产者将消息发送到交换机：生产者创建消息并发送到 RabbitMQ 的某个交换机。
2. 交换机根据绑定规则路由消息：交换机根据预定义的绑定规则和路由键决定将消息发送到哪个队列。
3. 消息存储在队列中：符合条件的队列接收并存储消息，直到消费者处理它们。
4. 消费者从队列中接收消息：一个或多个消费者连接到队列并从中提取消息进行处理。
5. 消息确认和处理：消费者处理消息后，可以确认（acknowledge）消息处理完成，以便 RabbitMQ 可以从队列中删除消息。

## RabbitMQ 的高级功能

### 持久化 (Persistence)

RabbitMQ 支持将消息持久化到磁盘，保证在服务器崩溃或重启后消息不会丢失。要持久化消息，可以将队列声明为持久的，并将消息标记为持久的。

### 确认机制 (Acknowledgment)

为了确保消息被成功处理，RabbitMQ 提供了消息确认机制。消费者在成功处理完消息后，可以发送确认消息（ack），告诉 RabbitMQ 可以从队列中删除该消息。如果消费者没有确认，RabbitMQ 可以重新将消息投递给其他消费者（取决于配置）。
发布确认 (Publisher Confirms)
对于生产者来说，发布确认是一种机制，用来确认消息是否已成功发送到队列。生产者可以等待 RabbitMQ 的确认响应，以确保消息的投递。

### 死信队列 (Dead Letter Queue, DLQ)

当消息不能被成功处理时，RabbitMQ 可以将其发送到一个死信队列。死信队列可以用来记录或重新处理失败的消息。

实现：

```java
@Configuration
public class BasicConfig {


    @Bean
    public DirectExchange basicDirectExchange(){
        return new DirectExchange("basic.direct.exchange");
    }

    @Bean
    public Queue basicQueue(){
        HashMap<String, Object> args = new HashMap<>();
        args.put("x-dead-letter-exchange","dead.letter.exchange");
        args.put("x-dead-letter-routing-key","dead.letter.routingKey");
        return new Queue("basic.queue",true,false,false,args);
    }

    @Bean
    public Binding bindBasicQueue(Queue basicQueue,DirectExchange basicDirectExchange){
        return BindingBuilder.bind(basicQueue).to(basicDirectExchange).with("basic.routingKey");
    }

    @Bean
    public Queue ttlQueue(){
        HashMap<String, Object> args = new HashMap<>();
        // 设置队列消息过期时间为3秒
        args.put("x-message-ttl",3000);
        // 当队列中的消息过期后会被转发到dead.letter.exchange死信交换机上
        args.put("x-dead-letter-exchange","dead.letter.exchange");
        // 转发到死信交换器上携带的路由键
        args.put("x-dead-letter-routing-key","dead.letter.routingKey");
        return new Queue("basic.ttl.queue",true,false,false,args);
    }

    @Bean
    public Binding bindTtlQueue(Queue ttlQueue,DirectExchange basicDirectExchange){
        return BindingBuilder.bind(ttlQueue).to(basicDirectExchange).with("ttl.routingKey");
    }

    @Bean
    public DirectExchange deadLetterExchange(){
        // 死信交换机
        return new DirectExchange("dead.letter.exchange");
    }

    @Bean
    public Queue deadQueue(){
        // 死信队列
        return new Queue("dead.queue",true);
    }

    @Bean
    public Binding dlxBinding(Queue deadQueue,DirectExchange deadLetterExchange){
        return BindingBuilder.bind(deadQueue).to(deadLetterExchange).with("dead.letter.routingKey");
    }

    @Bean
    public BasicSender basicSender(){
        return new BasicSender();
    }

    @Bean
    public BasicReceiver basicReceiver(){
        return new BasicReceiver();
    }

}
```

消息生产者

```java
public class BasicSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(BasicSender.class);


    @Resource
    private RabbitTemplate rabbitTemplate;

    @Resource
    private DirectExchange basicDirectExchange;

    // @Scheduled(fixedDelay = 1000)
    public void send(){
        String messageContent = "hello,world";
        rabbitTemplate.convertAndSend("basic.queue",messageContent);
        LOGGER.info("send message:{}",messageContent);
    }


    @Scheduled(fixedDelay = 4000)
    public void sendMessageToTtlQueue(){
        // 每4秒发送消息到TTL队列
        String messageContent = "hello,world";
        rabbitTemplate.convertAndSend(basicDirectExchange.getName(),"ttl.routingKey",messageContent);
        LOGGER.info("send message:{}",messageContent);
    }


    @Scheduled(fixedDelay = 4000)
    public void sendMessageWithExpire(){
        // 手动设置每条消息到过期时间，每过4秒发送一条消息
        String messageContent = "hello,world";
        MessageProperties messageProperties = new MessageProperties();
        messageProperties.setExpiration("3000");
        Message message = new Message(messageContent.getBytes(),messageProperties);
        rabbitTemplate.send(basicDirectExchange.getName(),"basic.routingKey",message);
        LOGGER.info("send message:{}",messageContent);
    }

}
```



消息消费者

```java
public class BasicReceiver {

    private static final Logger LOGGER = LoggerFactory.getLogger(BasicReceiver.class);

    @RabbitListener(queues = "basic.queue")
    public void receive(String message){
        LOGGER.info("receive message:{}",message);
    }


    @RabbitListener(queues = "dead.queue")
    public void receiveDeadMessage(String message){
        // 接收到死信队列中的消息
        LOGGER.info("receive message:{}",message);
    }

}
```

### 优先级队列 (Priority Queue)

RabbitMQ 支持优先级队列，允许消息根据优先级进行排序和处理。优先级较高的消息会比优先级较低的消息更早被消费者接收。

1. 配置队列的最大优先级

```java
    @Bean
    public Queue priorityQueue(){
        HashMap<String, Object> args = new HashMap<>();
        // 设置队列最大优先级为10
        args.put("x-max-priority",10);
        return new Queue("priority.queue",true,false,false,args);
    }

    @Bean
    public Binding bindPriorityQueue(Queue priorityQueue,DirectExchange basicDirectExchange){
        return BindingBuilder.bind(priorityQueue).to(basicDirectExchange).with("priority.routingKey");
    }
```

2. 发送带有优先级的消息

```java
    @Scheduled(fixedDelay = 1000)
    public void sendPriorityMessage(){
        MessageProperties messageProperties = new MessageProperties();
        if (count.incrementAndGet() == 10) {
            count.set(0);
        }
        messageProperties.setPriority(count.get());
        String messageContent = "hello,world - priority:" + count.get();
        Message message = new Message(messageContent.getBytes(),messageProperties);
        rabbitTemplate.send(basicDirectExchange.getName(),"priority.routingKey",message);
        LOGGER.info("send message:{}",messageContent);
    }
```



3. 消费者消费消息

```java
    @RabbitListener(queues = "priority.queue")
    public void receivePriorityMessage(String message) throws InterruptedException {
        LOGGER.info("priority listener receive message:{}",message);
        // 消费者暂停10秒
        Thread.sleep(10000);
    }
```

### 延迟消息 (Delayed Message)

通过插件或特定的实现方式，RabbitMQ 可以支持延迟消息的功能，即消息在一定的延迟时间后才会被投递到队列。Rabbit没有内置的延迟消息功能，可以通过 TTL+死信交换机的方式实现该功能

## RabbitMQ 的使用场景
- 任务队列：在微服务架构中，RabbitMQ 可以用于管理任务的分发和处理，将任务从生产者分发给多个消费者。
- 事件通知系统：在分布式系统中，RabbitMQ 可以用作事件总线，用于发布和订阅系统中的事件。
- 消息流管理：RabbitMQ 可以在流处理应用中管理和路由消息，确保消息按照设定的路径流动。
- 负载平衡：通过将消息均衡地分发到多个消费者，RabbitMQ 可以实现负载平衡。
- 数据同步：在多系统之间同步数据时，RabbitMQ 可以保证数据的一致性和可靠传递



## 消息模式



### 简单队列模式

> 在简单队列模式中，消息生产者（Producer）将消息发送到一个队列（Queue），而消息消费者（Consumer）从队列中接收消息并处理它们。

![image-20241029220219725](https://gitee.com/gj-coder/my-images/raw/master/images/image-20241029220219725.png)

#### 特点

1. 点对点通信：每条消息有且仅有一个消费者能够接收并处理
2. 消息顺序：消息在队列中按发送顺序被消费



#### 实现

配置：

```yaml
server:
  port: 9091
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: jay
    password: jay
    virtual-host: /learn
```



配置文件：

```java
@Configuration
public class SimpleRabbitMQConfig {

  	// 添加一个简单队列
    @Bean
    public Queue simpleQueue(){
        return new Queue("simple.queue");
    }

		// 添加一个消息生产者
    @Bean
    public SimpleSender simpleSender(){
        return new SimpleSender();
    }

  	// 添加一个消息消费者
    @Bean
    public SimpleReceiver simpleReceiver(){
        return new SimpleReceiver();
    }

}
```



消息生产者：

```java
public class SimpleSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleSender.class);

    private static final String QUEUE_NAME = "simple.queue";

    public static Long num = 0L;

    @Resource
    private RabbitTemplate rabbitTemplate;


 		// 消息生产者每过一秒发送一条消息
    @Scheduled(fixedDelay = 1000,initialDelay = 500)
    public void sender(){
        String message = "hello,world - " + num++;
        rabbitTemplate.convertAndSend(QUEUE_NAME,message);
        LOGGER.info("[x] send message:{}",message);
    }

}
```



消息消费者：

```java
// 消息消费者监听simple.queue队列
@RabbitListener(queues = "simple.queue")
public class SimpleReceiver {

    private static final Logger LOGGER = LoggerFactory.getLogger(SimpleReceiver.class);

  	// 接收消息并打印内容
    @RabbitHandler
    public void receive(String in){
        LOGGER.info("[x] receive message:{}",in);
    }

}
```



### 工作队列模式

> 在工作队列模式中，一个生产者将消息发送到一个队列中，多个消费者从该队列中竞争接收消息。这种模式用于将任务分配给多个工作者（消费者），以实现任务的负载均衡。

![image-20241029220251893](https://gitee.com/gj-coder/my-images/raw/master/images/image-20241029220251893.png)



#### 特点

多个消费者从同一个队列中接收消息，每个消息只能被一个消费者处理。

#### 实现

```java
@Configuration
public class WorkRabbitMQConfig {


    @Bean
    public Queue workQueue(){
        return new Queue("work.queue");
    }

    @Bean
    public WorkSender workSender(){
        return new WorkSender();
    }

    public static class ReceiverConfig {

        @Bean(name = "receiver_1")
        public WorkReceiver receiver_1(){
            return new WorkReceiver(1);
        }

        @Bean(name = "receiver_2")
        public WorkReceiver receiver_2(){
            return new WorkReceiver(2);
        }
    }
}
```



消息生产者：

```java
public class WorkSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkSender.class);

    private static final String QUEUE_NAME = "work.queue";

    @Resource
    private RabbitTemplate rabbitTemplate;

    private AtomicInteger dotNum = new AtomicInteger(0);

    private AtomicInteger count = new AtomicInteger(0);

  	// 每过一秒发送一条消息，消息`hello`后递增`.`
    @Scheduled(fixedDelay = 1000)
    public void send(){
        String message = "hello";
        if (dotNum.incrementAndGet() == 4) {
            dotNum.set(1);
        }
        for (int i = 0; i < dotNum.get(); i++) {
            message += ".";
        }
        message += count.incrementAndGet();
        rabbitTemplate.convertAndSend(QUEUE_NAME,message);
        LOGGER.info("[X] send message:{}",message);
    }

}
```

消息消费者：

```java
@RabbitListener(queues = "work.queue")
public class WorkReceiver {

    private static final Logger LOGGER = LoggerFactory.getLogger(WorkReceiver.class);


    private Integer instanceId;

    public WorkReceiver(Integer instanceId) {
        this.instanceId = instanceId;
    }


    @RabbitHandler
    public void receive(String in) throws InterruptedException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        LOGGER.info("instance:{} [x] receive message:{}",instanceId,in);
        doWork(in);
        stopWatch.stop();
        LOGGER.info("instance:{} [x] done in {} second",instanceId,stopWatch.getTotalTimeSeconds());

    }

  	// 模拟消息处理，当消息中含有较多的点时，处理时长增加。其他消费者会竞争接收消息
    public void doWork(String message) throws InterruptedException {
        for (char c : message.toCharArray()) {
            if (c == '.') {
                Thread.sleep(500);
            }
        }
    }
}

```



### 发布/订阅模式

> 发布/订阅模式（Publish/Subscribe Pattern）是一种消息传递模式，其中消息生产者（Publisher）将消息发布到一个交换机（Exchange），而不是直接发送到特定队列。然后，交换机会将消息复制发送到所有与之绑定的队列（Subscriber），这样所有订阅了该交换机的队列都会收到相同的消息。这种模式用于将一条消息广播给多个消费者。

![image-20241029220320459](https://gitee.com/gj-coder/my-images/raw/master/images/image-20241029220320459.png)

#### 实现

配置文件

```java
@Configuration
public class PubSubRabbitMQConfig {

    @Bean
    public FanoutExchange fanout(){
        return new FanoutExchange("fanout.exchange");
    }

    @Bean
    public PubSubSender pubSubSender(){
        return new PubSubSender();
    }

    public static class PubSubReceiverConfig {

        @Bean
        public Queue autoDeleteQueue1(){
            // 匿名队列
            return new AnonymousQueue();
        }


        @Bean
        public Queue autoDeleteQueue2(){
            // 匿名队列
            return new AnonymousQueue();
        }

        @Bean
        public Binding bing1(Queue autoDeleteQueue1,FanoutExchange fanout){
            return BindingBuilder.bind(autoDeleteQueue1).to(fanout);
        }

        @Bean
        public Binding bing2(Queue autoDeleteQueue2,FanoutExchange fanout){
            return BindingBuilder.bind(autoDeleteQueue2).to(fanout);
        }
        
        @Bean
        public PubSubReceiver pubSubReceiver(){
            return new PubSubReceiver();
        }
        
    }
}
```



消息生产者

```java
public class PubSubSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(PubSubSender.class);

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Resource
    private FanoutExchange fanoutExchange;

    private AtomicInteger dotNum = new AtomicInteger(0);

    private AtomicInteger count = new AtomicInteger(0);

    @Scheduled(fixedDelay = 1000)
    public void send(){
        String message = "hello";
        if (dotNum.incrementAndGet() == 4) {
            dotNum.set(1);
        }
        for (int i = 0; i < dotNum.get(); i++) {
            message += ".";
        }
        message += count.incrementAndGet();
        rabbitTemplate.convertAndSend(fanoutExchange.getName(),"",message);
        LOGGER.info("[X] send message:{}",message);
    }

}
```



消息消费者

```java
public class PubSubReceiver {

    private static final Logger LOGGER = LoggerFactory.getLogger(PubSubReceiver.class);

    @RabbitListener(queues = "#{autoDeleteQueue1.name}")
    public void receive_1(String in) throws InterruptedException {
        receive(in,1);
    }

    @RabbitListener(queues = "#{autoDeleteQueue2.name}")
    public void receive_2(String in) throws InterruptedException {
        receive(in,2);
    }



    public void receive(String in,Integer instanceId) throws InterruptedException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        LOGGER.info("instance:{} [x] receive message:{}",instanceId,in);
        doWork(in);
        stopWatch.stop();
        LOGGER.info("instance:{} [x] done in {} second",instanceId,stopWatch.getTotalTimeSeconds());

    }

    public void doWork(String message) throws InterruptedException {
        for (char c : message.toCharArray()) {
            if (c == '.') {
                Thread.sleep(500);
            }
        }
    }

}
```



### 路由模式

> 路由模式（Routing Pattern）是 RabbitMQ 中的一种消息传递模式，它通过使用 Direct Exchange 来实现消息的有选择性路由。在路由模式中，消息生产者将消息发送到交换机，并且可以在发送消息时指定一个或多个路由键（Routing Key），交换机根据消息的路由键将消息路由到绑定了匹配路由键的队列上



![image-20241029220343529](https://gitee.com/gj-coder/my-images/raw/master/images/image-20241029220343529.png)

#### 实现

配置类

```java
@Configuration
public class RouterRabbitMQConfig {

    @Bean
    public DirectExchange direct(){
        return new DirectExchange("direct.exchange");
    }


    @Bean
    public RouterSender routerSender(){
        return new RouterSender();
    }


    public static class ReceiverConfig {

        @Bean
        public Queue queue1(){
            return new Queue("direct.queue1");
        }


        @Bean
        public Queue queue2(){
            return new Queue("direct.queue2");
        }


        @Bean
        public Binding bing1(Queue queue1,DirectExchange direct){
            return BindingBuilder.bind(queue1).to(direct).with("orange");
        }

        @Bean
        public Binding bing2(Queue queue2,DirectExchange direct){
            return BindingBuilder.bind(queue2).to(direct).with("black");
        }

        @Bean
        public Binding bing3(Queue queue2,DirectExchange direct){
            return BindingBuilder.bind(queue2).to(direct).with("green");
        }

        @Bean
        public RouterReceiver routerReceiver(){
            return new RouterReceiver();
        }
    }
}

```

消息生产者

```java
public class RouterSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(RouterSender.class);

    @Resource
    private RabbitTemplate rabbitTemplate;

    @Resource
    private DirectExchange direct;

    private AtomicInteger index = new AtomicInteger(0);

    private AtomicInteger count = new AtomicInteger(0);


    private final String[] keys = {"orange","black","green"};
    @Scheduled(fixedDelay = 1000)
    public void send(){
        StringBuilder builder = new StringBuilder("Hello to ");
        if (this.index.incrementAndGet() == 3) {
            this.index.set(0);
        }
        String key = keys[this.index.get()];
        builder.append(key).append(' ');
        builder.append(this.count.get());
        String message = builder.toString();
        rabbitTemplate.convertAndSend(direct.getName(), key, message);
        LOGGER.info("[x] send message:{}",message);
    }

}
```



消息消费者

```java
public class RouterReceiver {

    private static final Logger LOGGER = LoggerFactory.getLogger(RouterReceiver.class);

    @RabbitListener(queues = "direct.queue1")
    public void receive_1(String in) throws InterruptedException {
        receive(in,1);
    }

    @RabbitListener(queues = "direct.queue2")
    public void receive_2(String in) throws InterruptedException {
        receive(in,2);
    }



    public void receive(String in,Integer instanceId) throws InterruptedException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        LOGGER.info("instance:{} [x] receive message:{}",instanceId,in);
        doWork(in);
        stopWatch.stop();
        LOGGER.info("instance:{} [x] done in {} second",instanceId,stopWatch.getTotalTimeSeconds());

    }

    public void doWork(String message) throws InterruptedException {
        for (char c : message.toCharArray()) {
            if (c == '.') {
                Thread.sleep(500);
            }
        }
    }

}

```



### 主题模式

> 主题模式（Topic Pattern）是 RabbitMQ 中的一种消息传递模式，它是在路由模式的基础上进行了扩展，允许消费者根据消息的内容进行更加灵活的订阅。

![image-20241029220404185](https://gitee.com/gj-coder/my-images/raw/master/images/image-20241029220404185.png)

工作原理

>  主题模式通过使用 Topic Exchange 来实现消息的灵活路由。在主题模式中，消息生产者将消息发送到交换机，并且可以指定一个路由键（Routing Key），而消费者则可以使用通配符来匹配路由键，从而选择性地接收消息。



通配符规则：

- `*`：匹配一个单词。

- `#`：匹配零个或多个单词。



#### 实现

配置类

```java
@Configuration
public class TopicRabbitMQConfig {

    @Bean
    public TopicExchange topic(){
        return new TopicExchange("topic.exchange");
    }

    @Bean
    public TopicSender topicSender(){
        return new TopicSender();
    }

    public static class TopicReceiverConfig {

        @Bean
        public Queue autoDeleteQueue1(){
            // 匿名队列
            return new AnonymousQueue();
        }


        @Bean
        public Queue autoDeleteQueue2(){
            // 匿名队列
            return new AnonymousQueue();
        }

        @Bean
        public Binding bing1(Queue autoDeleteQueue1,TopicExchange topic){
            return BindingBuilder.bind(autoDeleteQueue1).to(topic).with("*.orange.*");
        }

        @Bean
        public Binding bing2(Queue autoDeleteQueue2,TopicExchange topic){
            return BindingBuilder.bind(autoDeleteQueue2).to(topic).with("*.*.rabbit");
        }

        @Bean
        public Binding bing3(Queue autoDeleteQueue2,TopicExchange topic){
            return BindingBuilder.bind(autoDeleteQueue2).to(topic).with("lazy.#");
        }
        @Bean
        public TopicReceiver topicReceiver(){
            return new TopicReceiver();
        }

    }
}
```



消息生产者

```java
public class TopicSender {

    private static final Logger LOGGER = LoggerFactory.getLogger(TopicSender.class);

    @Resource
    private RabbitTemplate template;

    @Resource
    private TopicExchange topic;

    AtomicInteger index = new AtomicInteger(0);

    AtomicInteger count = new AtomicInteger(0);

    private final String[] keys = {"quick.orange.rabbit", "lazy.orange.elephant", "quick.orange.fox",
            "lazy.brown.fox", "lazy.pink.rabbit", "quick.brown.fox"};

    @Scheduled(fixedDelay = 1000, initialDelay = 500)
    public void send() {
        StringBuilder builder = new StringBuilder("Hello to ");
        if (this.index.incrementAndGet() == keys.length) {
            this.index.set(0);
        }
        String key = keys[this.index.get()];
        builder.append(key).append(' ');
        builder.append(this.count.incrementAndGet());
        String message = builder.toString();
        template.convertAndSend(topic.getName(), key, message);
        LOGGER.info("[x] send message:{}",message);
    }

}
```



消息消费者

```java
public class TopicReceiver {

    private static final Logger LOGGER = LoggerFactory.getLogger(TopicReceiver.class);

    @RabbitListener(queues = "#{autoDeleteQueue1.name}")
    public void receive_1(String in) throws InterruptedException {
        receive(in,1);
    }

    @RabbitListener(queues = "#{autoDeleteQueue2.name}")
    public void receive_2(String in) throws InterruptedException {
        receive(in,2);
    }



    public void receive(String in,Integer instanceId) throws InterruptedException {
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();
        LOGGER.info("instance:{} [x] receive message:{}",instanceId,in);
        doWork(in);
        stopWatch.stop();
    }

    public void doWork(String message) throws InterruptedException {
        for (char c : message.toCharArray()) {
            if (c == '.') {
                Thread.sleep(500);
            }
        }
    }

}
```

