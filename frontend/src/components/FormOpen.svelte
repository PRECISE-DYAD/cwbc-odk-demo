<script>
  export let formId;
  export let label;
  import Button from "@smui/button";

  function openForm() {
    return odkTables.openTable(null, formId, null, null);
  }
</script>

<!-- WiP TODO - bind properly to odkTable -->
<p>Form Open</p>
<Button>Mat Button</Button>
<button on:click={openForm}>{label}</button>
