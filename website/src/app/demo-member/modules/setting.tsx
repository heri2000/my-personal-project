import { enEN } from "@/app/translations/enEN";

export const CURRENT_PAGE_SETTING = "current_page_setting";

export function Setting() {
  const translationStrings = enEN;

  return (
    <div className="standard_content">
      <h1 className="page_title">{translationStrings.setting}</h1>
      <h2 className="page_title">{translationStrings.setting}</h2>
      <h3 className="page_title">{translationStrings.setting}</h3>
      <div>
        <p>Vivamus in tempus nisi, a sodales sem. Nullam sed dolor egestas, consequat erat sed, lobortis sem. In lacinia ut mi id auctor. Ut tincidunt dui eget ex fermentum pulvinar. Aliquam erat volutpat. Pellentesque luctus efficitur blandit. Donec molestie elementum accumsan. Cras sodales diam massa, ut accumsan ligula posuere ut. Etiam pretium lacus eget tincidunt consequat. Fusce vulputate lobortis tortor, sit amet blandit risus sagittis in. Vestibulum pharetra lacus facilisis faucibus congue. Ut sem tortor, venenatis at odio sed, commodo mattis velit. Nulla a quam vitae nibh placerat elementum.</p>
        <p>Ut ultricies magna eget imperdiet vestibulum. Cras vehicula vel orci a hendrerit. Suspendisse suscipit dolor id risus eleifend faucibus. Aliquam et varius turpis, venenatis vulputate nisi. Aenean non aliquet ex, eget fermentum tortor. Vivamus pulvinar molestie sodales. Vestibulum tortor arcu, vestibulum ac vulputate egestas, posuere eu tortor. In ornare neque at dolor scelerisque, sed suscipit tellus lacinia. Vestibulum maximus sollicitudin sollicitudin. Etiam venenatis sapien vitae mauris porttitor eleifend.</p>
        <p>Nullam condimentum quis metus vitae egestas. Quisque pellentesque eros eget lectus vehicula, quis volutpat ante ultrices. Duis eget maximus quam. Praesent dignissim magna mattis, volutpat diam non, ornare nunc. Cras vitae magna at massa molestie accumsan facilisis sit amet purus. Quisque rutrum eu quam a tincidunt. Phasellus finibus arcu nec venenatis malesuada. Morbi est metus, convallis vitae ullamcorper id, lobortis quis nisi. Nulla congue dignissim auctor. Suspendisse commodo placerat metus quis molestie. Sed gravida consequat dolor tristique pretium. Aliquam erat volutpat. Proin sodales vitae libero vitae mattis. Praesent sit amet diam a dui fringilla dictum. Morbi metus magna, faucibus non consequat sit amet, ullamcorper eget arcu.</p>
      </div>
    </div>
  );
}
