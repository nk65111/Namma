
import { Download, Features, SectionWrapper } from './components';
import assets from './assets';
import styles from './styles/Global';

const App = () => {
  return (
    <>
      <SectionWrapper
        title="Smart app for Passanger and driver. Less Effort More Profit"
        description="lets download and join it. Join as a driver for more profit, join as passanger for more flexibilty"
        showBtn
        mockupImg={assets.hero}
        banner="banner"
      />
      <SectionWrapper
        title="Smart User Interface"
        description="Experience a buttery UI of Raahi Passanger and driver app. Smooth constant colors of a fluent UI design."
        mockupImg={assets.shedularmMockeup}
        reverse
      />
      <Features />
      <SectionWrapper
        title="Deployment"
        description="Raahi(Passanger app and driver app) is built using React native and backend is develop on spring boot and postgresql which runs natively on all users' devices. You can easily get your app into people's hands"
        mockupImg={assets.driver}
        reverse
      />
      <SectionWrapper
        title="Creative way to showcase the store"
        description="Raahi contains two apps. The first app for passanger where customer can book ride(Multiply ride book at same time). Second app for driver where driver can see their booking details and wallet but first driver have to complete their kyc."
        mockupImg={assets.threePages}
        banner="banner02"
      />
      <Download />

      <div className="px-4 py-2 justify-center items-center bg-primary flex-col text-center banner04">
        <p className={`${styles.pText} ${styles.whiteText}`}>Made for Namma hackerthon
        </p>
      </div>
    </>
  );
}

export default App;
