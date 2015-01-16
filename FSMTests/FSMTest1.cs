using System;
using NUnit.Framework;


    
public class FSMTest1
{
    [Test]
    public void test()
    {
        TestClass test = new TestClass();
        Assert.AreEqual(0, test.getInt());
        Assert.AreEqual(0, test.getFloat());
        Assert.AreEqual("IncrementInt", test.GetFSM().GetNameOfCurrentState());

        test.update();
        Assert.AreEqual(1, test.getInt());
        Assert.AreEqual(0, test.getFloat());

        test.update();
        Assert.AreEqual(2, test.getInt());
        Assert.AreEqual(0, test.getFloat());

        test.update();
        Assert.AreEqual(3, test.getInt());
        Assert.AreEqual(0, test.getFloat());

        test.update();
        Assert.AreEqual(4, test.getInt());
        Assert.AreEqual(0, test.getFloat());
        Assert.AreEqual("IncrementInt", test.GetFSM().GetNameOfCurrentState());

        test.update();
        Assert.AreEqual(0, test.getInt());
        Assert.AreEqual(0, test.getFloat());
        Assert.AreEqual("IncrementFloat", test.GetFSM().GetNameOfCurrentState());

        test.update();
        Assert.AreEqual(0, test.getInt());
        Assert.AreEqual(1, test.getFloat());

        test.update();
        Assert.AreEqual(0, test.getInt());
        Assert.AreEqual(2, test.getFloat());

        test.update();
        Assert.AreEqual(0, test.getInt());
        Assert.AreEqual(3, test.getFloat());

        test.update();
        Assert.AreEqual(0, test.getInt());
        Assert.AreEqual(4, test.getFloat());

        test.update();
        Assert.AreEqual(0, test.getInt());
        Assert.AreEqual(0, test.getFloat());

        Assert.AreEqual("IncrementInt", test.GetFSM().GetNameOfCurrentState());

        test.GetFSM().RevertToPreviousState();

        Assert.AreEqual("IncrementFloat", test.GetFSM().GetNameOfCurrentState());

        Assert.AreEqual(true, test.GetFSM().isInState(IncrementFloat.getInstance()));

        Assert.AreEqual(false, test.GetFSM().isInState(IncrementInt.getInstance()));

        Assert.AreEqual(IncrementFloat.getInstance(), test.GetFSM().CurrentState());

        Assert.AreEqual(IncrementInt.getInstance(), test.GetFSM().PreviousState());

        Assert.AreEqual(null, test.GetFSM().GlobalState());
        
    }
}

