package wsserver;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

class Address {
  String name;
  String zipcode;
}

@WebService
@SOAPBinding(style=SOAPBinding.Style.RPC)
public class Hello {
  public String sayHello(String name) {
    System.out.println("sayHello called with " + name);
    return "Hello " + name;
  }
  public String getGUID() {
    System.out.println("sayGUID called");
    return "DEADFACE";
  }
  public String sayBye(String name, int number) {
    System.out.println("sayBye called with " + name + " and " + number);
    return "Hello " + name + " and " + number;
  }
}