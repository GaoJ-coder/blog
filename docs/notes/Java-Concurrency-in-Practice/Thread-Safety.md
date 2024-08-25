---
title: 线程安全性
author: GaoJ
createTime: 2024/08/25 09:50:22
permalink: /Java-Concurrency-in-Practice/l9rqkkd4/
---

## 线程安全性

> 编写线程安全的代码，其核心在于对访问状态操作进行管理，特别是对共享的（shared）和可变的（mutable）状态的访问

当多个线程访问某个类时，不管运行时环境采用何种调度方式或者这些线程将如何交替执行，并且在主调代码中不需要任何额外的同步或协同，这个类能表现出
正确行为，那么就称这个类是线程安全的。

## 原子性

> 原子操作是指，对于访问同一状态的所有操作（包括操作本身），这个操作是以一个原子的方式执行的操作。


::: details 竞态条件
当某个计算的正确性取决于多个线程的交替执行时序时，那么就会发生竞态条件。

基于一种可能失效的观察结果来做出的判断或者执行某个计算，这种类型的竞态条件称为“先检查后执行”
:::

示例：延迟初始化（典型的“先检查后执行”的例子）
```java
public class LazyInitRace{
    private Instace instance = null;
    
    public Instance getInstance(){
        if(instance == null){
            instance = new instance();
        }
        return instance;
    }
}
```

## 加锁机制

### 内置锁

> Java提供了一种内置的锁机制来支持原子性：同步代码块（synchronized block）。
> Java的内置锁相当于一个互斥体（或互斥锁），这意味着最多只有一个线程能持有这种锁。

`synchronized`关键字可以用来锁定以下几种对象：
1. **实例方法:**
锁住的是当前实例对象。当一个线程进入同步方法时，其他线程无法访问同一个实例的其他同步方法或同步块。
```java
public synchronized void instanceMethod() {
    // 锁的是当前实例对象 (this)
}
```
2. **静态方法:**
锁住的是整个类的类对象，即Class对象。无论该类有多少实例，它们共享一个类锁。
```java
public static synchronized void staticMethod() {
    // 锁的是类对象 (ClassName.class)
}
```
3. **同步块:**
锁住的是同步块中指定的对象。可以锁住任意对象，不限于this或Class对象。
```java
public void someMethod() {
    Object lockObject = new Object();
    synchronized(lockObject) {
        // 锁的是lockObject对象
    }
}
```
4. **`this`对象**
可以在同步块中显式锁定当前实例对象。
```java
public void anotherMethod() {
    synchronized(this) {
        // 锁的是当前实例对象 (this)
    }
}
```
5. **类对象:**
直接在同步块中锁定某个类的类对象。
```java
public void classMethod() {
    synchronized(ClassName.class) {
        // 锁的是ClassName的类对象
    }
}
```

### 重入

> 内置锁是可以重入的，因此如果某个线程试图获得一个已经由它自己持有的锁，那么这个请求就会成功。重入意味着获取锁的粒度是线程，而不是调用。

重入锁的一种实现方式是，为每个锁关联一个计数器和一个所有者线程。当计数器为0时，这个锁就认为时没有任何线程持有。当线程请求一个未被持有的
锁时，JVM会记下锁的持有者，并且将获取计数器的值设置为1。如果同一线程再次获取这个锁，计数将递增，而当线程退出同步代码块时，计数器会递减。
当计数值为0时，这个锁将被释放。

示例：
```java
public class Father{
    public synchronized void doSomething(){
    ...
    }
}

public class Son extends Father{
    public synchronized void doSomethind(){
        System.out.println("son do something");
        super.doSomething();
    }
}
```
Father和Son的doSomething都需要获得锁，如果内置锁不可重入，那么在调用super.doSomething()时永远无法获得Father上的锁，因为这个锁已经被持有，。
就会产生死锁。

## 用锁来保护状态

> 每个共享和可变的变量都应该只由一个锁来保护，从而使维护人员知道是哪一个锁

一种常见的加锁约定是：将所有可变状态都封装在对象内部，并通过对象的内置锁对所有访问可变状态的代码路径进行同步，使得在该对象上不会发生并发访问。
具体实现方式：
1. **封装可变状态：**
将所有的可变状态（通常是对象的字段）封装在类的私有成员中，确保外部无法直接访问它们。
通过公有方法（通常是getter和setter）来操作这些可变状态。

2. **同步访问：**
使用sychronized关键字将访问或修改可变状态的方法或代码块同步起来，确保同一时间只有一个线程可以访问这些方法或代码块。
这通常使用对象的内置锁，即this，来进行同步。

```java
public class SafeCounter {
    private int count = 0; // 封装的可变状态

    // 使用synchronized同步方法对可变状态的访问进行保护
    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

## 活跃性与性能
要判断同步代码块的合理大小，需要在各种设计需求之间进行权衡，包括安全性（必须得到满足）、简单性和性能。

::: warning
当执行时间较长的计算或者可能无法快速完成的操作时（例如，网络I/O或控制台I/O），一定不要持有锁。
:::