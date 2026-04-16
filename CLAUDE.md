<frontend_rule>
SRP(단일 책임 원칙)을 적용해서 해당 컴포넌트에서만 사용이 되는 요소 같은 경우에는 다음과 같은 구조로 구성을 해야 합니다.
- {ui_component_name} : PascalCase
    - index.tsx(필수)
    - types.ts(필수)
    - styles.ts
    - hooks.ts
    - helpers.ts
    - utils.ts
    - constants.ts
    - store.ts
    - index.test.tsx
- {hook_component_name} : camelCase
- {util_component_name} : camelCase
- {folder_name} : kebab-case
</frontend_rule>
