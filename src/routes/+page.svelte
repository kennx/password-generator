<script lang="ts">
  export const ssr = false;
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  import { syncLock } from '../svg/image';
  import {
    UPPER_CHARACTERS,
    LOWER_CHARACTERS,
    NUMBER_CHARACTERS,
    SPECIAL_CHARACTERS
  } from '../constants/characters';
  import './page.css';
  import type Rule from '../interface/rule.interface';

  const rules: Array<Rule> = [
    {
      name: 'upperLetter',
      include: true,
      includeText: '包含大写字母(ABCDEF…)',
      first: 1,
      length: 3,
      firstText: '首字大写',
      characters: UPPER_CHARACTERS
    },
    {
      name: 'lowerLetter',
      include: true,
      includeText: '包含小写字母(abcdef…)',
      first: 2,
      length: 3,
      firstText: '首字小写',
      characters: LOWER_CHARACTERS
    },
    {
      name: 'number',
      include: true,
      includeText: '包含数字(123456…)',
      first: 3,
      firstText: '首字数字',
      length: 3,
      characters: NUMBER_CHARACTERS
    },
    {
      name: 'special',
      include: true,
      includeText: '包含特殊字符(!@#$%^…)',
      first: 4,
      firstText: '首字特殊字符',
      length: 3,
      characters: SPECIAL_CHARACTERS
    }
  ];

  let result = '';

  let copiedOK = false;

  let charactersLength = 12;

  spring({
    stiffness: 0.1,
    damping: 0.1
  });
  let rotate = spring(0);

  let firstLetter = 0;

  $: rules.map((rule) => {
    if (!rule.include) {
      if (firstLetter === rule.first) {
        firstLetter = 0;
      }
      rule.length = 0;
    }
  });

  $: disabled = rules.filter((rule) => !rule.include).length === rules.length;

  function inputRangeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    charactersLength = Number(input.value);
    generateString();
  }

  function generateCharacters(source: string, maxlength: number): string {
    let str = '';
    const length = source.length;
    for (let i = 0; i < maxlength; i++) {
      const index = Math.floor(Math.random() * length);
      str += source[index];
    }
    return str;
  }

  function randomIndex(maxLength: number) {
    return Math.floor(Math.random() * maxLength);
  }

  function allocationRulesLength() {
    const includeRules = rules.filter((rule) => rule.include);
    const _length = Math.floor(charactersLength / includeRules.length);
    const _remainder = charactersLength % includeRules.length;
    includeRules.map((rule) => (rule.length = _length));
    if (_remainder > 0) {
      const randomIdx = randomIndex(includeRules.length);
      includeRules[randomIdx].length += _remainder;
    }
    return includeRules;
  }

  function mergeCharacter() {
    const _rules = allocationRulesLength();
    _rules.map((rule) => {
      rule.result = generateCharacters(rule.characters, rule.length);
    });
    return _rules;
  }

  function sortCharacters(arr: Array<Rule>) {
    let firstCharacter = '';
    arr.map((rule) => {
      if (rule.first === firstLetter && rule.result) {
        firstCharacter = rule.result[0];
        rule.result = rule.result.substring(1);
      }
    });
    const _reuslt = arr.map((rule) => rule.result).join('');
    return firstCharacter + _reuslt;
  }

  function shuttleCharacters() {
    const _rules = mergeCharacter();
    const characters = _rules.sort(() => Math.random() - Math.random());
    const _reuslt = sortCharacters(characters);
    return _reuslt;
  }

  function generateString(event?: Event) {
    result = '';
    result = shuttleCharacters();
    rules.map((rule) => (rule.result = undefined));
  }

  function copyClipboard(event: Event) {
    const input = event.target as HTMLInputElement;
    input.select();
    try {
      navigator.clipboard.writeText(input.value);
      if (!copiedOK) {
        copiedOK = true;
        setTimeout(() => {
          copiedOK = false;
          window.getSelection()?.empty();
        }, 1500);
      }
    } catch (error) {
      window.getSelection()?.empty();
    }
  }

  onMount(() => {
    if (!result) {
      generateString();
    }
  });
</script>

<div class="pg">
  <div class="pg-card">
    <div class="pg-card-field">
      <input
        name="result"
        type="text"
        on:click={copyClipboard}
        class="outline-none"
        readonly
        bind:value={result}
        placeholder="Abcdef1234&^&"
      />
      <button
        {disabled}
        on:click={generateString}
        on:mousedown={() => rotate.set(360)}
        on:mouseup={() => rotate.set(0)}
        style="transform: rotate({$rotate}deg)"
      >
        {@html syncLock}
      </button>
    </div>

    <div class="flex items-center mt-8">
      <input
        {disabled}
        on:change={inputRangeChange}
        type="range"
        class="flex-1"
        max="24"
        min="6"
        bind:value={charactersLength}
        step="1"
      />
      <div class="text-gray-400 ml-2 text-sm">长度 {charactersLength}</div>
    </div>

    <div class="p-4 mt-6">
      <hr class="my-4" />
      {#each rules as { name, include, includeText } (name)}
        <div class="flex items-center mt-3">
          <input
            type="checkbox"
            id="includes_{name}"
            bind:checked={include}
            on:change={generateString}
          /><label class="ml-2 text-gray-500 text-sm" for="includes_{name}">{includeText}</label>
        </div>
      {/each}
      <hr class="mt-4" />
    </div>

    <div class="p-4">
      <div class="flex flex-row max-sm:flex-col text-sm text-gray-500 space-x-4 max-sm:space-x-0">
        <div class="flex items-center">
          <input
            type="radio"
            id="firstDefault"
            bind:group={firstLetter}
            value={0}
            on:change={generateString}
          />
          <label for="firstDefault" class="ml-1">无</label>
        </div>
        {#each rules as { name, include, first, firstText } (name)}
          <div class="flex items-center">
            <input
              type="radio"
              id="first_{name}"
              bind:group={firstLetter}
              value={first}
              disabled={!include}
              on:change={generateString}
            /> <label for="first_{name}" class="ml-1">{firstText}</label>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>


{#if copiedOK}
  <div class="toast" transition:fly={{ y: -15, duration: 150 }}>
    <p>复制成功!</p>
  </div>
{/if}
