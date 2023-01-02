import Protect from "../../Components/Layout/Protect";
import NeedleStickForm from "../../Components/Form/NeedleStickForm";
const NeedleStick = () => {
  return (
    <Protect level={4}>
      <NeedleStickForm />
    </Protect>
  );
};

export default NeedleStick;
