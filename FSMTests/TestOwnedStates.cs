
public class IncrementInt : State<TestClass>
{
    private static IncrementInt instance;

    private IncrementInt() { }


    public static IncrementInt getInstance()
    {

        if (instance == null)
        {
            instance = new IncrementInt();
        }

        return instance;
        
    }

    public override void Enter(TestClass test)
    {
        test.setInt(0);

    }


    public override void Execute(TestClass test)
    {
        //the miner digs for gold until he is carrying in excess of MaxNuggets. 
        //If he gets thirsty during his digging he packs up work for a while and 
        //changes state to go to the saloon for a whiskey.
        test.setInt(test.getInt()+1);


        //if enough gold mined, go and put it in the bank
        
        if (test.getInt() >= 5)
        {
            test.GetFSM().ChangeState(IncrementFloat.getInstance());
        }
        

    }


    public override void Exit(TestClass test)
    {
        test.setInt(0);
    }


}

public class IncrementFloat : State<TestClass>
{
    private static IncrementFloat instance;

    private IncrementFloat() { }


    public static IncrementFloat getInstance()
    {

        if (instance == null)
        {
            instance = new IncrementFloat();
        }

        return instance;

    }

    public override void Enter(TestClass test)
    {
        test.setFloat(0);

    }


    public override void Execute(TestClass test)
    {
        //the miner digs for gold until he is carrying in excess of MaxNuggets. 
        //If he gets thirsty during his digging he packs up work for a while and 
        //changes state to go to the saloon for a whiskey.
        test.setFloat(test.getFloat() + 1);


        //if enough gold mined, go and put it in the bank
        if (test.getFloat() >= 5)
        {

            test.GetFSM().ChangeState(IncrementInt.getInstance());
        }

    }


    public override void Exit(TestClass test)
    {
        test.setFloat(0);
    }


}

