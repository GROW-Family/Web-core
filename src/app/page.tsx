import Button from "@/components/common/Button";
import ImageViewer from "@/components/common/ImageViewer";
import { colors } from "@/styles/theme";

import tesst from '@static/images/404_tip.png';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button background={colors.black} color={colors.white} text="Gửi" />
      <ImageViewer src={tesst} size={400} isObectFit/>
    </div>
  );
}
