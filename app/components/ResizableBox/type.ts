/**
Polymorphism은 한국어로 다형성이라고 부르는데, 여러 개의 형태를 가진다라는 의미를 가진 그리스어에서 유래된 단어다. 
컴퓨터 과학에서 다형성은 프로그래밍적인 요소가 여러 형태로 표현 될 수 있는 것을 의미하는데 보통은 객체가 여러 자료형으로 나타날 수 있음을 표현할 때 사용한다.

그럼 Polymorphic한 UI 컴포넌트는 다양한 형태의 UI 컴포넌트라고 바꿔 말할 수 있을 것이다.
- 다양한 Semantic을 표현할 수 있는 UI 컴포넌트
- 다양한 속성을 가질 수 있는 UI 컴포넌트
- 다양한 스타일을 가질 수 있는 UI 컴포넌트
좀 더 풀어서 웹 프론트엔드에서의 Polymorphic 컴포넌트는, 코드에 따라 어떠한 요소(Element)도 될 수 있고 그에 따른 속성(Attribute)도 사용할 수 있다. 
즉, 상황에 맞는 Semantic을 사용할 수 있고 앵커 태그처럼 특수한 용도로 사용되는 컴포넌트가 될 수도 있다. 
결국 無의 형태에서 무엇이든지 될 수 있는 컴포넌트가 되는 것이 Polymorphic 컴포넌트고 가장 추상화된 형태의 컴포넌트라고 볼 수 있다.
출처: https://kciter.so/posts/polymorphic-react-component/
 */

// 기존 HTML 엘리먼트를 as prop으로 전달받은 HTML 엘리먼트로 변경할 수 있는 타입
type AsProps<T extends React.ElementType> = {
  as?: T;
};

// as prop을 포함한 컴포넌트의 props key 목록
type KeyWithAs<T extends React.ElementType, CustomProps> = keyof (AsProps<T> &
  CustomProps);

// React.Element 타입을 가지고 있는 컴포넌트의 props 타입
export type ElementTypeProps<T extends React.ElementType> =
  React.ComponentProps<T>;

// as prop을 포함한(=다형성) 커스텀 컴포넌트의 props 타입(Ref 없음)
export type PolymorphicComponentProps<
  T extends React.ElementType,
  CustomProps = object,
> = (CustomProps & AsProps<T>) &
  Omit<React.ComponentPropsWithoutRef<T>, KeyWithAs<T, CustomProps>>;

// T 제네릭으로 형태를 변경시킬 수 있는 다형성 컴포넌트의 props 타입(Ref 있음)
export type PolymorphicRef<T extends React.ElementType> =
  React.ComponentPropsWithRef<T>["ref"];

export type PolymorphicComponentPropsWithRef<
  T extends React.ElementType,
  CustomProps = object,
> = CustomProps & { ref?: PolymorphicRef<T> };
