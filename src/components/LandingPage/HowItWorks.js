import login from "../../assets/landing/login.png";
import login2 from "../../assets/landing/login2.png";
import login3 from "../../assets/landing/login3.png";
import login4 from "../../assets/landing/login4.png";
import login5 from "../../assets/landing/login5.png";
import login6 from "../../assets/landing/login6.png";
import pana from "../../assets/pana.png";
import bro from "../../assets/bro.png";
import compter from "../../assets/compter.png";

const HowItWorksSection = () => {
  return (
    <div className="howItWorks">
      <div className="inner">
        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "150px" }}
              src={login}
              alt="icon"
            />
            <span className="head">
              1. Register Your Business On 360-Station
            </span>
            <div className="texts">
              Start your journey towards streamlined management by registering
              your business on the 360-Station platform. Through our
              user-friendly registration process, upload detailed information
              about your organisation, this ensures an accurate representation
              of your business within the system. Registering your business
              allows you to access the comprehensive features and
              functionalities of the 360-Station system. Then proceed to my
              stations on the platform to register your outlets.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "150px" }}
              src={login2}
              alt="icon"
            />
            <span className="head">2. Create a Fueling Outlets</span>
            <div className="texts">
              Once you have registered, you can create individual filling
              stations within the 360-Station platform. This feature enables you
              to accurately represent and manage multiple locations or branches
              of your fueling business. For each station, you can specify its
              unique details, such as the physical address, geolocation, the
              station’s alias name, the cost and selling prices of the products
              (PMS, AGO & DPK), amenities available at the station like Lube
              bay, mini-mart, etc and any other relevant information specific to
              that station. This allows for precise monitoring and control over
              each filling station in your network.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "150px" }}
              src={login3}
              alt="icon"
            />
            <span className="head">3. Add Tanks to the Fueling Outlets</span>
            <div className="texts">
              Within each filling station, you can add tanks that serve as
              storage containers for the fuel products you offer. By adding
              tanks to your outlets, you establish a direct connection between
              the physical infrastructure and the 360-Station system. When
              adding tanks, you provide detailed specifications for each tank,
              including the tank capacity, fuel type (PMS, DPK, AGO), tank
              identification numbers and their balances as at the time of
              registration. This ensures that the system accurately reflects the
              inventory available at each station and enables seamless inventory
              management.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "150px" }}
              src={login4}
              alt="icon"
            />
            <span className="head">4. Add Pump to the Tank in Your Outlet</span>
            <div className="texts">
              Once tanks are set up, you can register the fuel dispensing pumps
              with their names and current totaliser readings at the time of
              registration and then associate fuel pumps with the corresponding
              tanks in your filling station.Adding pumps to tanks establishes
              the link between the fuel storage and dispensing units. This step
              ensures that the system accurately tracks fuel dispensing
              activities and maintains accurate records of pump usage, sales,
              and tank levels.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "150px" }}
              src={login5}
              alt="icon"
            />
            <span className="head">
              5. Record Your Daily Sales, Payments and Expenses
            </span>
            <div className="texts">
              With your filling stations, tanks, and pumps set up, assigned
              managers can begin recording the daily sales transactions of their
              stations by inputing the closing totaliser readings of all used
              pumps for the day, updating the return to tank page if any,
              corporate sales update, recording expenses & payments, as well as
              inputing the dipping levels of all product tanks in the station,
              within the 360-Station system. This feature allows you to capture
              comprehensive data related to product sales, including the volume
              of fuel dispensed, pricing information, customer payment methods,
              and any additional expenses associated with the entire operation.
              By recording these details accurately and in real-time, you gain
              valuable insights into your fueling business's financial
              performance and can make informed decisions based on up-to-date
              information.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "150px" }}
              src={login6}
              alt="icon"
            />
            <span className="head">6. Add Tanks to the Fueling Outlets</span>
            <div className="texts">
              When you buy products in bulk from oil depots, you can register
              the order on this platform and you can keep track of how the
              product gets evacuated to your stations/outlets by using the next
              step which is incoming order.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "150px" }}
              src={pana}
              alt="icon"
            />
            <span className="head">7. Create Incoming Order</span>
            <div className="texts">
              For each truck you load from your product order, you are going to
              register it as an incoming order by filling out the create
              incoming order form on its tab which involves details like;
              quantity loaded, destination of discharge, waybill details and
              driver details, etc.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "150px", height: "130px" }}
              src={bro}
              alt="icon"
            />
            <span className="head">8. Supply</span>
            <div className="texts">
              When the truck that was loaded an incoming order arrives the
              station that was set for it as destination of discharge and then
              gets discharged, the manager can then go to the supply tab and
              search for the truck by inputing the waybill number of the truck
              and then input the quantity that they actually discharged and in
              which tank. The system automatically picks up if there is overage
              or shortage in the supply.
            </div>
          </div>
        </div>

        <div className="items">
          <div className="inner">
            <img
              style={{ width: "170px", height: "140px" }}
              src={compter}
              alt="icon"
            />
            <span className="head">
              9. Monitor and Manage Tanks in the Fueling Station
            </span>
            <div className="texts">
              Monitor and Manage Tanks in the Filling Stations: In addition, the
              360-Station system provides ongoing monitoring and management
              capabilities for your filling station tanks. You can continuously
              update tank information, including supply levels, tank
              inspections, maintenance records, and compliance certifications.
              This ensures that you maintain full visibility and control over
              your inventory, enabling proactive management of stock levels,
              reordering supply when needed, and minimising shortage or overage.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
