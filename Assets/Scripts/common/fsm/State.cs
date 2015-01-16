using System.Collections.Generic;


public class State<T>
{
    public State() { }


    //public virtual ~State(){}

    //this will execute when the state is entered
    public virtual void Enter(T owner) { }

    //this is the states normal update function
    public virtual void Execute(T owner) { }

    //this will execute when the state is exited.
    public virtual void Exit(T owner) { }

}
