<script lang="ts">
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

  let result = '';

  let copiedOK = false;
  let clicked = false;

  let wordLength = 12;
  let includesUpperCase = true;
  let includesLowerCase = true;
  let includesNumber = true;
  let includesSpecial = true;

  let upperSize = 3;
  let lowerSize = 3;
  let numberSize = 3;
  let specialSize = 3;

  spring({
    stiffness: 0.1,
    damping: 0.1
  });
  let rotate = spring(0);

  let firstLetter = 0;

  $: if (!includesUpperCase && firstLetter === 1) {
    firstLetter = 0;
  }
  $: if (!includesLowerCase && firstLetter === 2) {
    firstLetter = 0;
  }
  $: if (!includesNumber && firstLetter === 3) {
    firstLetter = 0;
  }
  $: if (!includesSpecial && firstLetter === 4) {
    firstLetter = 0;
  }

  $: if (!includesUpperCase) {
    upperSize = 0;
  } else if (!includesLowerCase) {
    lowerSize = 0;
  } else if (!includesNumber) {
    numberSize = 0;
  } else if (!includesSpecial) {
    specialSize = 0;
  }

  $: disabled = !includesUpperCase && !includesLowerCase && !includesNumber && !includesSpecial;

  function randomLength(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function inputRangeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    wordLength = Number(input.value);
  }

  function generateCharacters(source: string, maxSize: number): string {
    let str = '';
    const SIZE = source.length;
    for (let i = 0; i < maxSize; i++) {
      const index = Math.floor(Math.random() * SIZE);
      str += source[index];
    }
    return str;
  }

  $: availableRule = [includesUpperCase, includesLowerCase, includesNumber, includesSpecial].filter(
    (bool) => bool
  );

  function generateString() {
    const ra = Array();
    let size = wordLength;
    let average = Math.floor(wordLength / availableRule.length);
    average = average === Infinity ? 0 : average;
    if (average) {
      for (let i = availableRule.length; i > 0; i--) {
        if (i === 1) {
          ra.push(size);
        } else {
          ra.push(average);
        }
        size = size - average;
      }
      const str =
        generateCharacters(UPPER_CHARACTERS, upperSize) +
        generateCharacters(LOWER_CHARACTERS, lowerSize) +
        generateCharacters(NUMBER_CHARACTERS, numberSize) +
        generateCharacters(SPECIAL_CHARACTERS, specialSize);
      const arr = str.split('');
      let _result = arr.sort(() => Math.random() - Math.random()).join('');
      result = '';
      for (let i = 0; i < _result.length; i++) {
        result += _result[i];
      }
    }
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
    generateString();
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
        bind:value={wordLength}
        step="1"
      />
      <div class="text-gray-400 ml-2 text-sm">长度 {wordLength}</div>
    </div>

    <div class="p-4 mt-6">
      <hr class="my-4" />
      <div class="flex items-center mt-3">
        <input type="checkbox" id="includesUpperCase" bind:checked={includesUpperCase} /><label
          class="ml-2 text-gray-500 text-sm"
          for="includesUpperCase">包含大写字母(ABCDEF…)</label
        >
      </div>

      <div class="flex items-center mt-3">
        <input type="checkbox" id="includesLowerCase" bind:checked={includesLowerCase} /><label
          class="ml-2 text-gray-500 text-sm"
          for="includesLowerCase">包含小写字母(abcdef…)</label
        >
      </div>

      <div class="flex items-center mt-3">
        <input type="checkbox" id="includesNumber" bind:checked={includesNumber} /><label
          class="ml-2 text-gray-500 text-sm"
          for="includesNumber">包含数字(123456…)</label
        >
      </div>

      <div class="flex items-center mt-3">
        <input type="checkbox" id="includesSpecial" bind:checked={includesSpecial} /><label
          class="ml-2 text-gray-500 text-sm"
          for="includesSpecial">包含特殊字符(!@#$%^…)</label
        >
      </div>
      <hr class="mt-4" />
    </div>

    <div class="p-4">
      <div class="flex flex-row max-sm:flex-col text-sm text-gray-500 space-x-4 max-sm:space-x-0">
        <div class="flex items-center">
          <input type="radio" id="firstDefault" bind:group={firstLetter} value={0} />
          <label for="firstDefault" class="ml-1">无</label>
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="firstUpper"
            bind:group={firstLetter}
            value={1}
            disabled={!includesUpperCase}
          /> <label for="firstUpper" class="ml-1">首字大写</label>
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="firstLower"
            bind:group={firstLetter}
            value={2}
            disabled={!includesLowerCase}
          />
          <label for="firstLower" class="ml-1">首字小写</label>
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="firstNumber"
            bind:group={firstLetter}
            value={3}
            disabled={!includesNumber}
          /> <label for="firstNumber" class="ml-1">首字数字</label>
        </div>
        <div class="flex items-center">
          <input
            type="radio"
            id="firstSpecial"
            bind:group={firstLetter}
            value={4}
            disabled={!includesSpecial}
          /> <label for="firstSpecial" class="ml-1">首字特殊字符</label>
        </div>
      </div>
    </div>
  </div>
</div>

{#if copiedOK}
  <div class="toast" transition:fly={{ y: -15, duration: 150 }}>
    <p>复制成功!</p>
  </div>
{/if}
