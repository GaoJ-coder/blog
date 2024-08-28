---
title: 对象的共享
author: GaoJ
createTime: 2024/08/27 20:30:04
permalink: /Java-Concurrency-in-Practice/0ekqfws4/
---
## 可见性

> 防止某个线程正在使用对象状态而另外一个线程同时修改该状态，而且确保当一个线程修改了对象状态后其他线程能看到发生的状态变化

### 失效数据

> 在缺乏同步的程序中可能会出现的错误结果,例如下例get方法在多线程中可能会读取到一个已经失效的值。除非每次访问时都同步，
> 否则可能获得该变量的一个失效值

```java
public class MutableInteget{
    private int value;
    
    public int get(){
        return value;
    }
    
    public void set(int value){
        this.value = value;
    }
}
```

### 非原子的64位操作

> 最低安全性: 当线程在没有同步的情况下读取变量时，可能会得到一个失效值，但至少是这个值由之前的线程设置的，而不是一个随机值。这种安全性保证也被成为最低安全性

::: warning
最低安全性适用于绝大多数的变量，但是有一个例外：非volatile类型的64位数值。
:::

Java内存模型要求，变量的读取和写入操作都必须是原子操作. 但对于非volatile的long和double变量，jvm允许将64位读操作和写操作分为两个32位操作。
当读取到一个非volatile的long变量时，如果对变量的读操作和写操作在不同的线程中执行，那么很有可能会读取到某个值的高32位和另一个值的低32位。

### 加锁与可见性

> 加锁的含义不仅仅局限于互斥行为，还包括内存可见性。为了确保所有线程都能看到变量的最新值，所有执行读操作或者写操作的线程都必须在同一个锁上同步。

### volatile变量
Java语言提供了一种稍弱的同步机制，即volatile变量，用来确保将变量的更新操作通知到其他线程。

::: warning
加锁机制既可以确保可见性也可以确保原子性，而volatile变量只能确保可见性
:::

当且仅当满足一下条件时，才可以使用volatile变量
- 对变量的写入操作不依赖变量当前值，或者确保只有单个线程更新变量的值
- 该变量不会与其他状态变量一起纳入不变性条件中
- 在访问变量时不需要加锁


## 线程封闭

> 当访问共享的可变数据时，通常需要使用同步。一种避免使用同步的方式就是不共享数据。如果仅在单线程内访问数据，就不需要同步。这种技术被称为线程封闭

常见的线程封闭技术例如JDBC，在典型的服务器应用中，线程从连接池获得一个Connection对象，并且用该对象来处理请求，使用完后在将对象返还给连接池。
由于大多数请求（例如servlet请求）都是由单个线程采用同步的方式来处理，并且在Connection对象返回之前，连接池不会再将其分配给其他线程。
因此，这种 连接管理模式在处理请求时隐含地将Connection对象封闭在线程中

### Ad-hoc线程封闭
Ad-hoc线程封闭是指，维护线程封闭性的职责完全由程序实现来承担。例如可见性修饰符或局部变量，能将对象封闭到目标线程上。

### 栈封闭
栈封闭是线程封闭的一种特例，在栈封闭中，只能通过局部变量才能访问对象。在方法内部声明的局部变量是栈封闭的，因为它们仅存在于方法的执行上下文中，不会被其他线程访问。
```java
public class StackConfinementExample {
    public void doSomething() {
        int localVariable = 42; // 局部变量，栈封闭
        // 其他线程无法访问localVariable，因此是线程安全的
        System.out.println(localVariable);
    }
}
```

### ThreadLocal类
维持线程封闭的一种更规范的方式是使用TreadLocal，这个类能使线程中的某个值与保存值的对象关联起来。ThreadLocal提供了get和set等访问方法，这些方法为
每个使用变量的线程都存有一份独立的副本，因此get总是返回由当前执行线程在调用set是设置的最新值。


## 不变性

满足同步需求的另外一种方法是使用不可变对象。
::: warning
不可变对象一定是线程安全的。
:::

### 使用Volatile类型来发布不可变对象


```java
public class ImmutableExample {
    private volatile ImmutableObject immutableObject;

    public void updateImmutableObject(String newValue) {
        immutableObject = new ImmutableObject(newValue);
    }

    public ImmutableObject getImmutableObject() {
        return immutableObject;
    }
}

final class ImmutableObject {
    private final String value;

    public ImmutableObject(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
```
**解释**
- ImmutableObject类：这个类是不可变的。它的字段value是final，并且仅通过构造函数赋值，之后不能再修改。
- volatile关键字：ImmutableExample类中的immutableObject字段被声明为volatile，这意味着当一个线程更新immutableObject时，其他线程能立即看到这个更新。
- 发布：当immutableObject被赋值时，新创建的不可变对象立即对其他线程可见。

**使用volatile的优点**
- 可见性：volatile保证了所有线程对最新值的可见性，这在多线程环境中非常重要。
- 线程安全：由于不可变对象一旦创建后不能改变，它们本质上是线程安全的。使用volatile发布不可变对象可以确保引用的最新性。
- 轻量级锁机制：相比使用sychronized或其他显式锁，volatile提供了更轻量级的同步机制，不涉及线程阻塞和上下文切换的开销。

::: warning
- 只适用于不可变对象：使用volatile发布可变对象时要格外小心。尽管volatile能确保引用的可见性，但它不能保证对象内部状态的同步。
- 原子性：volatile仅能保证引用的可见性和有序性，不能保证操作的原子性。对volatile变量的复合操作（如递增）仍然需要同步。
:::



::: info
在并发程序中使用和共享对象时，可以使用一些使用的策略，包括
- 线程封闭：线程封闭对象只能由一个线程拥有，对象被封闭在线程中，并且只能由这个线程修改
- 只读共享：在没有额外同步的情况下，共享的只读对象可以由多个程序并发访问，但任何线程都不能修改它，共享的只读对象包括不可变对象和事实不可变对象
- 线程安全共享：线程安全的对象在其内部实现同步吗，因此多个线程可以通过对象的公有接口进行访问，而不需要进一步的同步
- 保护对象：被保护的对象只能通过持有特定的锁来访问。保护对象包括封装在其他线程安全对象中的对象，以及已发布的并且有某个特定锁保护的对象。
:::

