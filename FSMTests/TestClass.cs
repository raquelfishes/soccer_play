using System;
using System.Collections.Generic;



public class TestClass
{
    StateMachine<TestClass> m_pStateMachine;

    private int myInt;

    private float myFloat;

    public TestClass()
    {
        myInt = 0;
        myFloat = 0;
        m_pStateMachine = new StateMachine<TestClass>(this);

        m_pStateMachine.SetCurrentState(IncrementInt.getInstance());
    }

    public void update()
    {
        //myInt++;
        m_pStateMachine.Update();

    }

    public void setInt(int i){

        myInt = i;
    }

    public int getInt()
    {

        return myInt;
    }

    public void setFloat(float i){

        myFloat = i;
    }

    public float getFloat()
    {

        return myFloat;
    }

    public StateMachine<TestClass> GetFSM(){return m_pStateMachine;}


}

